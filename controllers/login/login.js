const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { UsuarioExistLDAPRequestDTO, UsuarioLDAPRequestDTO, UserDto } = require("../../models/login/dtos");
const { loginSchema } = require("../../middleware/schemas/login");
const validatorHandler = require("../../middleware/validator");
const { makeErrorResponse } = require("../../models/response");

const { getLastSession, updateLastSession } = require("../callDatabases");
const getDataFromOrchestrator = require("../orchestrator");
const { getBroker } = require("../invokeLambdas");

const { LDAP_NAME, VERIFY_USER, CONSULT_USER } = require("../../constants/soapOrchestrator");
/*const { getBrokerChildrenInfo } = require("../../utils/childrenInfo");
const { getCompaniesInfo } = require("../../utils/companiesInfo");*/
const { getModulesToRender } = require("../../utils/modulesInfo");
const { desCripto, enCripto } = require("../../utils/DesCripto");
const { getTokenInformation } = require("../../utils/token");
const { arrParseToString } = require("../../utils/parsers");
const { getSecretManager } = require("../../utils/secret");
const {  saveLog, customLevelsLog  } = require("../../utils/log");
const { MODULES } = require("../../constants/modules");
const loginUserAD = require("../../utils/LDAP");

const { OU } = process.env;

////funcion crear y carga el token , carga informacion de las claves 
const getInfoToLogin = async ({ brokerId, user, sourceIP, numberIdLogin, deleteToken = false }) => {
  const { tipoid, numeroid } = user;
  const identification = `${tipoid}${numeroid}`.toLowerCase().trim();
  /*En el primer paso de autenticación del gestor, no se envía ninguna información del intermediario. Sin embargo, 
  en el segundo paso de autenticación del gestor, se envía la clave del intermediario
  y se recibe la información correspondiente del intermediario.*/
  let broker = {};
  if (!user.isGestor || brokerId !== null) {
    const brokerInfo = await getBroker(brokerId);
    const { childrenKeys, brokerKey, businessName } = brokerInfo;
    if (brokerInfo === null) return makeErrorResponse(`Broker ${brokerId} not found`, 400);
    if (user.isGestor || user.isAdministrador) {
      const childrenInfo = {}// await getBrokerChildrenInfo({ childrenKeys, brokerKey, businessName });
      const companiesInfo = {}//await getCompaniesInfo();
      broker = {
        ...brokerInfo,
        childrenInfo,
        companiesInfo,
      };
    } else {
      let clavesHijas = user.claveshijas.map(i => Number(i));;

      let childrenInfo = {}


      const found = clavesHijas.find(element => element === brokerKey);

      if (found) {

        childrenInfo = {}// await getBrokerChildrenInfo({ childrenKeys, brokerKey, businessName });

      }
      else {
        brokerInfo.childrenKeys = clavesHijas;

        childrenInfo = {}// await getBrokerChildrenInfo({ childrenKeys: clavesHijas, brokerKey, businessName });
      }
      const companiesInfo = {}//await getCompaniesInfo();
      broker = {
        ...brokerInfo,
        childrenInfo,
        companiesInfo,
      };
    }
  }
  //console.log("broker-->", broker);
  //console.log("brokerId-->", brokerId);
  //console.log("user.isGestor-->", user.isGestor);
  //valida si el broker principal esta activo, si es falso no debe permitir autenticarse 
  if (brokerId !== null && brokerId !== "")
    if (broker.leavingDate !== "1900-01-01 00:00:00" && !user.isGestor) {
      return makeErrorResponse({
        isBrokerActivo: false,
        message: " Tu cuenta tiene una restricción de acceso, para mayor información contactate con tu gestor."
      }, 400);
    }
  const lastSessionInfo = await getLastSession(identification);
  const date = dayjs.utc().format("DD/MM/YYYY HH:mm:ss:SSS");
  const timestamp = dayjs.utc().valueOf();
  const lastSessionDate = lastSessionInfo && lastSessionInfo.date ? lastSessionInfo.date : date;
  const loginInfo = {
    userId: identification,
    brokerId: brokerId,
    date,
    lastDate: lastSessionDate,
    ipAddress: sourceIP,
  };


  const updateLastSessionResponse = await updateLastSession(loginInfo);
  if (!updateLastSessionResponse) return makeErrorResponse("Problems updating sessionInfo", 400);

  const modules = await getModulesToRender(identification);
  user.modulos = arrParseToString(modules);
  const infoToTokenizer = setDataToTokenizer(user, brokerId);
  const { timeout, accessToken, refreshToken } = await getTokenInformation(infoToTokenizer);
  const usuario = {
    ...user,
    clave: brokerId,
    modulos: modules,
  };
  if (user.isGestor) usuario.currentToken = accessToken;
  if (deleteToken) delete usuario.currentToken;
  //se colocala el valor NumeberId que viene en  login para solucionar error de recuperar constraseña
  //cuando el sameAccountname no igual al numero ingresado en el login
  usuario.numeroid = numberIdLogin;
  const responseBody = {
    loginInfo,
    accessToken,
    refreshToken,
    modules,
    timeout,
    broker,
    timestamp,
    user: usuario,
  };

  return responseBody;
};
let UsuarioCompleto = {};
let brokerId = null;


const requestLogin = async (data) => {  
  const loginValidator = validatorHandler(loginSchema, data);
  const isValid = typeof loginValidator !== "object";
  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect login body ${validationError}`, 422);
  }

  const secretToken = await getSecretManager();
  const notValidSecret = !secretToken || !secretToken.KEYDES;
  if (notValidSecret) throw Error(`Error secret ${secretToken}`);
  const KEYDES = secretToken.KEYDES;
  const KEYPASS = secretToken.KEYPASS;

  try {
    const { type, number, password, sourceIP } = data;
    const identification = `${type}${number}`;

    const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion = identification;
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName = identification;

    const UsuarioExistRequestResponse = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: VERIFY_USER,
      body: UsuarioExistRequest,
    });

    if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO) {
      let UsuarioLDAPRequest = setDataRequestUsuarioLDAP(UsuarioExistRequestResponse);
      const UsuarioLDAPRequestResponse = await getDataFromOrchestrator({
        soapName: LDAP_NAME,
        methodName: CONSULT_USER,
        body: UsuarioLDAPRequest,
      });
      let usuarios = UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap ? UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap : [];

      if (usuarios.length > 0) {


        //buscar en la lista de usuarios el que corresponda al distinguishedName de la peticion anterior
        //let usuario = UsuarioExistRequestResponse.usuarioBasicoLDAPDTO;
        let usuario = usuarios.find(x => x.distinguishedName === UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName);
        if (usuario) {
          ///verificamos que el usuario se de pruebas
          if ((usuario.distinguishedName.includes("OU=PREP") || usuario.distinguishedName.includes("OU=DEV"))) {
            //en caso estar en ambiente dev o UAT
            if (OU == "PREP" || OU == "DEV") {
              UsuarioCompleto = setDataUsuarioLdapCollectionDtoToUser(usuario);
            }
            else {
              return makeErrorResponse("Usuario o contraseña no válido", 500);
            }
            //si el usuario no tiene la rama prep o dev se deja autenticas normal
          } else {
            UsuarioCompleto = setDataUsuarioLdapCollectionDtoToUser(usuario);
          }


          try {
            //Invalid Credentials
            var authenticate = await loginUserAD(usuario.samaccountName, desCripto(password, KEYDES));
            if (authenticate) {
              UsuarioCompleto.login = authenticate;
              UsuarioCompleto.app = encodeURIComponent(enCripto(desCripto(password, KEYDES), KEYPASS));
              saveLog({
                level: customLevelsLog.levels.info,
                message: "Login Success",
                data: {
                  file: "login.js",
                  function: "LoginUser",
                  ip: data?.sourceIP,
                  user: identification,  
                },
              })
            }
            else {
              if (UsuarioCompleto.bloqueoLdap || !UsuarioCompleto.isUsuarioActivo) {
                const responseBody = {
                  user: UsuarioCompleto,
                };
                return responseBody;

              };
              return makeErrorResponse("Usuario o contraseña no válido", 500);
            }
          } catch (err) {
            console.log(JSON.stringify(err));
            if (UsuarioCompleto.bloqueoLdap || !UsuarioCompleto.isUsuarioActivo) {
              const responseBody = {
                user: UsuarioCompleto,
              };
              console.log("Error bloqueo ldap logueo fallido", JSON.stringify(responseBody));
              return responseBody;
            };
            return makeErrorResponse(err, 500);
          }
        } else {
          return makeErrorResponse("Usuario o contraseña no válido", 500);
        }

      } else {
        return makeErrorResponse("Usuario o contraseña no válido", 500);
      }

    } else {
      return makeErrorResponse("Usuario o contraseña no válido", 500);
    }
    if (UsuarioCompleto.bloqueoLdap && UsuarioCompleto.forzarModPassword){
      return makeErrorResponse("Usuario o contraseña no válido", 500);
    }
    if (UsuarioCompleto.login) {
      if (UsuarioCompleto.bloqueoLdap || !UsuarioCompleto.isUsuarioActivo) {

        const responseBody = {
          user: UsuarioCompleto,
        };
        return responseBody;
      };
      brokerId = UsuarioCompleto.isGestor ? null : UsuarioCompleto.clave;
      let loginResponse = await getInfoToLogin({ brokerId, user: UsuarioCompleto, numberIdLogin: number, sourceIP });

      return loginResponse;
    }

    return makeErrorResponse("Usuario o contraseña no válido", 500);
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Login Success",
      data: {
        file: "login.js",
        function: "LoginUser",
        ip: data?.sourceIP,
        dataError: err,  
      },
    })
    return makeErrorResponse(err.message, 500);
  }
};

const setDataToTokenizer = (user, brokerId) => {
  let information = { ...user };
  const invalidKeys = [null, "null", undefined, "undefined", ""];
  const isDifferentUser = String(information.clave) !== String(brokerId);
  if (invalidKeys.includes(information.clave) || isDifferentUser) information.clave = brokerId;

  delete information.currentToken;
  delete information.isValidado;
  delete information.isUsuarioActivo;
  delete information.forzarModPassword;
  delete information.passwordExpiro;
  delete information.bloqueoLdap;

  return information;
};

const setDataRequestUsuarioLDAP = (userData) => {
  const UsuarioLDAPRequest = { ...UsuarioLDAPRequestDTO };
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.loginName = userData.usuarioBasicoLDAPDTO.loginName;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName = userData.usuarioBasicoLDAPDTO.distinguishedName;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isGestor = userData.usuarioBasicoLDAPDTO.isGestor;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isAdministrador = userData.usuarioBasicoLDAPDTO.isAdministrador;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.descripcion = userData.descripcion;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.nombreAplicacion = userData.nombreAplicacion;
  UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.servidorExterno = userData.servidorExterno;

  return UsuarioLDAPRequest;
};

const setDataUsuarioLdapCollectionDtoToUser = (userData) => {
  const User = { ...UserDto };
  /* operacion =  Administrador = 1 Consulta = 2 Gestor = 3 GestorSarlaft = 4*/
  if (!userData.isGestor) {
    let atributosPersonalizados = userData.listaUsuarioApp[0].atributosPersonalizados;
    User.clave = atributosPersonalizados.find(x => x.nombreAtributo === "clavePrincipal").valoresPersonalizados[0];
    if (userData.isAdministrador) {
      User.operacion = 1;
      User.claveshijas = [User.clave]
    } else {
      User.operacion = 2;
      let validarHijas = atributosPersonalizados.find(x => x.nombreAtributo === "clavesHijas");
      if (validarHijas) {
        User.claveshijas = atributosPersonalizados.find(x => x.nombreAtributo === "clavesHijas").valoresPersonalizados;
      } else {
        User.claveshijas = [User.clave]
      }
    }
  } else {
    User.operacion = 3;
  }

  User.tipoid = userData.tipoDocumento;
  User.numeroid = userData.numeroDocumento;
  User.email = userData.email;
  User.usuario = userData.samaccountName;
  User.name = userData.loginName;
  User.modulos = MODULES;
  User.celular = userData.celular;
  User.isAdministrador = userData.isAdministrador;
  User.isValidado = userData.isValidado;
  User.isUsuarioActivo = userData.isUsuarioActivo;
  User.forzarModPassword = userData.forzarModPassword;
  User.passwordExpiro = userData.passwordExpiro;
  User.bloqueoLdap = userData.bloqueoLdap;
  User.oleoductoWeb = userData.oleoductoWeb;
  User.isGestor = userData.isGestor;
  User.profileName = `${userData.nombre.trim()} ${userData.apellido.trim()}`;

  return User;
};

module.exports = {
  requestLogin,
  getInfoToLogin,
  setDataToTokenizer,
};
