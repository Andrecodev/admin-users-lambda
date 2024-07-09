const validatorHandler = require("../middleware/validator");
const { makeErrorResponse } = require("../models/response");
const { UsuarioExistLDAPRequestDTO, usuarioPwdLDAPRequestDTO } = require("../models/login/dtos");
const { changePasswordSchema } = require("../middleware/schemas/changePassword");
const { setDataRequestUsuarioLDAP, setDataUsuarioLdapCollectionDtoToUser } = require('../utils/DtoToEntity');
const getDataFromOrchestrator = require("./orchestrator");
const { LDAP_NAME, VERIFY_USER, CONSULT_USER, PASSWORD_RECOVERY } = require("../constants/soapOrchestrator");
const { desCripto } = require("../utils/DesCripto");
const loginUserAD = require("../utils/LDAP");
const { saveLog, customLevelsLog } = require('../utils/log');
const { SUBJECTMAIL } = require('../constants/Mail');
const { sendEmail } = require('../utils/mail');
const { URL_PORTAL} = process.env;
const { getSecretManager } = require("../utils/secret");


const requestChangePassword = async (data) => {
  const changePasswordValidator = validatorHandler(changePasswordSchema, data);
  const isValid = typeof changePasswordValidator !== "object";
  if (!isValid) {
    const validationError = JSON.stringify(changePasswordValidator.details);
    return makeErrorResponse(`Incorrect changePassword body ${validationError}`, 422);
  }
  const secretToken = await getSecretManager();  
  const notValidSecret = !secretToken || !secretToken.KEYDES;
  if (notValidSecret) throw Error(`Error secret ${secretToken}`);
  const KEYDES = secretToken.KEYDES;  
  try {
    const { type, number, password, newPassword } = data;
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
        let usuario = usuarios.find(x => x.distinguishedName === UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName);
        if (usuario) {        
          try {
            if (usuario.isGestor) {
              //definir mensaje de error cuando es gestor 
              return makeErrorResponse("No se puede realizar cambio de contraseña de un usuario gestor", 500);
            }
            var authenticate = await loginUserAD(usuario.samaccountName, desCripto(password, KEYDES));
            if (authenticate) {
              let usuarioPwdLDAPRequest = usuarioPwdLDAPRequestDTO;
              usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.loginName = usuario.distinguishedName;
              //evita solicitar cambio de contraseña al iniciar sesion 
              usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.forzarModPassword = false;
              usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password = desCripto(newPassword, KEYDES);

              const usuarioPwdLDAPRequestResponse = await getDataFromOrchestrator({
                soapName: LDAP_NAME,
                methodName: PASSWORD_RECOVERY,
                body: usuarioPwdLDAPRequest,
              });
              
              if (usuarioPwdLDAPRequestResponse.estadoOperacionDTO.estadoTransaccion) {
                try {
                  saveLog({
                    level: customLevelsLog.levels.info,
                    message: "Cambio de contrasena",                                      
                    data: {
                      function: "requestChangePassword",
                      file: "changePassword.js", 
                      ip: data.sourceIP,
                      User: usuario.loginName,
                      result: true
                    },
                  })
                  let dataMail = {
                    NombreCompleto: usuario.nombre + " " + usuario.apellido,
                    lblLink: 'INGRESAR AL PORTAL',
                    LinkportalIntermediario:URL_PORTAL

                  }
                  var mail = await sendEmail(
                    usuario.email,
                    SUBJECTMAIL.CHANGEPASSWORD,
                    dataMail
                  );

                  return { mensaje: mail.response, email: usuario.email, changePassword: true };
                } catch (err) {
                  console.log(JSON.stringify(err));
                  saveLog({
                    level: customLevelsLog.levels.error,
                    message: "Cambio de contrasena",
                    
                    data: {
                      file: "changePassword.js",
                      function: "requestChangePassword",
                      ip: data.sourceIP,
                      User: identification,
                      dataError: err
                    },
                  })
                  return makeErrorResponse(err.message, 500);
                }
              }else {
                saveLog({
                  level: customLevelsLog.levels.error,
                  message: "Cambio de contrasena",                  
                  data: {
                    file: "changePassword.js",
                    function: "requestChangePassword",
                    ip: data.sourceIP,
                    User: identification,
                    dataError: err
                  },
                })
                return makeErrorResponse("actulizacion de contraseña fallo " +JSON.stringify(usuarioPwdLDAPRequestResponse), 500);
              }
            } else {
              return makeErrorResponse("autenticacion de usuario fallo", 500);
            }
          } catch (err){
            if(usuario.bloqueoLdap){
              console.log(JSON.stringify(err));
              return makeErrorResponse({bloqueoLdap:true}, 500);
            }

            console.log(JSON.stringify(err));
            return makeErrorResponse(err.message, 500);
          }
        } else {
          return makeErrorResponse("Usuario no encontrado ", 500);
        }

      } else {
        return makeErrorResponse("Usuario no encontrado " +JSON.stringify(UsuarioLDAPRequestResponse), 500);
      }

    } else {
      return makeErrorResponse("Usuario o contraseña no válido" +JSON.stringify(UsuarioExistRequestResponse), 500);
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Cambio de contrasena",      
      data: {
        file: "changePassword.js",
        function: "requestChangePassword",
        ip: data.sourceIP,
        User: identification,
        dataError: err
      },
    })
    return makeErrorResponse(err.message, 500);
  }
};



module.exports = {
  requestChangePassword,

};
