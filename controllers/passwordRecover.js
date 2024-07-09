const generator = require('generate-password');
const { faker } = require('@faker-js/faker');
const { UsuarioExistLDAPRequestDTO, usuarioPwdLDAPRequestDTO } = require('../models/login/dtos');
const passwordRecoverSchema = require('../middleware/schemas/passwordRecover');
const { makeErrorResponse, makeOkResponse } = require('../models/response');
const validatorHandler = require('../middleware/validator');
const dayjs = require("dayjs")
const { saveLog, customLevelsLog } = require('../utils/log');
const { LDAP_NAME, VERIFY_USER, CONSULT_USER, PASSWORD_RECOVERY, } = require('../constants/soapOrchestrator');
const { setDataRequestUsuarioLDAP } = require('../utils/DtoToEntity');
const { SUBJECTMAIL } = require('../constants/Mail');
const { sendEmail } = require('../utils/mail');

const getDataFromOrchestrator = require('./orchestrator');

const { URL_PORTAL } = process.env;

const requestPasswordRecover = async (data) => {
  const loginValidator = validatorHandler(passwordRecoverSchema, data);
  const isValid = typeof loginValidator !== 'object';

  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect passwordRecover body ${validationError}`, 422);
  }

  const { type, number } = data;
  const identification = `${type}${number}`;
  
  try {
    let mailFake = faker.internet.email();
    let mailFakexxx = "xxxxxxx" + mailFake.slice(5, mailFake.length);

    const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
  
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion =
      identification;
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName =
      identification;
   
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
        //console.log("usuarios",usuarios);
        //buscar en la lista de usuarios el que corresponda al distinguishedName de la peticion anterior
        let usuario = usuarios.find((x) => x.distinguishedName === UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName);
      
        if (usuario) {
        
          if (usuario.isGestor) {
            return { mensaje: "true", mail: mailFakexxx, changePassword: true };
          }

          const estimatedMinutes = 30
          const currentDate = dayjs().format('YYYY-MM-DD HH:mm')
          const finalDate = dayjs(currentDate).add(estimatedMinutes, 'minutes').format('YYYY-MM-DD HH:mm')
          

          if (usuario.bloqueoLdap) {
            const estimatedMinutes = 30
            const currentDate = dayjs().format('YYYY-MM-DD HH:mm')
            const finalDate = dayjs(currentDate).add(estimatedMinutes, 'minutes').format('YYYY-MM-DD HH:mm')
           
            return makeErrorResponse(`Usuario bloqueado hasta las ${finalDate}`)
          }

          if (!usuario.isValidado) {
            //definir mensaje de error cuando el usuario no es valido
            return makeErrorResponse("Debe primero verificar el usuario", 500);
          }

          if(!usuario?.isUsuarioActivo) {
            return makeErrorResponse({
              "error" : "usuario bloqueado",
              "message" : "Su usuario se encuentra inactivo temporalmente, por favor contacte al administrador para desbloquearlo"
            }, 403)
          }

          let usuarioPwdLDAPRequest = usuarioPwdLDAPRequestDTO;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.loginName = usuario.distinguishedName;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.forzarModPassword = true;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password = generator.generate({ length: 16, numbers: true, symbols: true, excludeSimilarCharacters: true, exclude: "<.*?>" });
        
          const usuarioPwdLDAPRequestResponse = await getDataFromOrchestrator({
            soapName: LDAP_NAME,
            methodName: PASSWORD_RECOVERY,
            body: usuarioPwdLDAPRequest,
          });
        
          if (usuarioPwdLDAPRequestResponse.estadoOperacionDTO.estadoTransaccion) {
            try {
              saveLog({
                level: customLevelsLog.levels.info,
                message: "Peticion recuperacion contrasena",
                data: {
                  file: "passwordRecover.js",
                  function: "requestPasswordRecover",
                  ip: data.sourceIP,
                  User: usuario.loginName,
                  result: true
                },
              })
        
              let mailXXX = "xxxxxxx" + UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.email.slice(5, UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.email.length);
        
              let dataMail = {
                NombreCompleto: usuario.nombre + " " + usuario.apellido,
                usuarioCC: usuario.samaccountName,
                password: usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password,
                lblLink: 'INGRESO PORTAL',
                LinkportalIntermediario: URL_PORTAL,
              }
        
              var mail = await sendEmail(
                usuario.email,
                SUBJECTMAIL.PASSWORDRECOVER,
                dataMail
              );

              return { mensaje: "true", mail: mailXXX, changePassword: true };

            } catch (err) {
              saveLog({
                level: customLevelsLog.levels.error,
                message: "Peticion recuperacion contrasena",

                data: {
                  file: "passwordRecover.js",
                  function: "requestPasswordRecover -- usuarioPwdLDAPRequest",
                  ip: data.sourceIP,
                  User: usuario.loginName,
                  dataError: err
                },
              })

              console.log(JSON.stringify(err));
              return makeErrorResponse(err.message, 500);
            }
          } else {
            saveLog({
              level: customLevelsLog.levels.error,
              message: "Peticion recuperacion contrasena",

              data: {
                file: "passwordRecover.js",
                function: "requestPasswordRecover",
                ip: data.sourceIP,
                User: usuario.loginName,
                result: usuarioPwdLDAPRequestResponse
              },
            })
            return makeErrorResponse("No se pudo actualizar " + JSON.stringify(usuarioPwdLDAPRequestResponse), 500);
          }
        }
        return { mensaje: "true", mail: mailFakexxx, changePassword: true };
      }
      return { mensaje: "true", mail: mailFakexxx, changePassword: true };
    }
    return { mensaje: "true", mail: mailFakexxx, changePassword: true };
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Peticion recuperacion contrasena",

      data: {
        file: "passwordRecover.js",
        function: "requestPasswordRecover",
        ip: data.sourceIP,
        User: identification,
        dataError: err
      },
    })

    return makeErrorResponse(err.message, 500);
  }
};


const requestPasswordRecoverAdminUsers = async (data) => {
  const loginValidator = validatorHandler(passwordRecoverSchema, data);
  const isValid = typeof loginValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect passwordRecover body ${validationError}`, 422);
  }
  const { type, number } = data;
  const identification = `${type}${number}`;
  try {

    const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion =
      identification;
    UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName =
      identification;
    const UsuarioExistRequestResponse = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: VERIFY_USER,
      body: UsuarioExistRequest,
    });
    //console.log("UsuarioExistRequestResponse",UsuarioExistRequestResponse)
    if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO) {
      let UsuarioLDAPRequest = setDataRequestUsuarioLDAP(UsuarioExistRequestResponse);
      const UsuarioLDAPRequestResponse = await getDataFromOrchestrator({
        soapName: LDAP_NAME,
        methodName: CONSULT_USER,
        body: UsuarioLDAPRequest,
      });
      //console.log("UsuarioLDAPRequestResponse",JSON.stringify(UsuarioLDAPRequestResponse))
      let usuarios = UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap ? UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap : [];
      if (usuarios.length > 0) {
        //console.log("usuarios",usuarios);
        //buscar en la lista de usuarios el que corresponda al distinguishedName de la peticion anterior
        let usuario = usuarios.find((x) => x.distinguishedName === UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName);
        if (usuario) {
          //console.log("usuario",usuario);
          if (usuario.isGestor) {
            //definir mensaje de error cuando es gestor 
            return { mensaje: "true", mail: mailFakexxx, changePassword: true };
          }
          let usuarioPwdLDAPRequest = usuarioPwdLDAPRequestDTO;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.loginName = usuario.distinguishedName;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.forzarModPassword = true;
          usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password = generator.generate({ length: 16, numbers: true, symbols: true, excludeSimilarCharacters: true, exclude: "<.*?>" });
          const usuarioPwdLDAPRequestResponse = await getDataFromOrchestrator({
            soapName: LDAP_NAME,
            methodName: PASSWORD_RECOVERY,
            body: usuarioPwdLDAPRequest,
          });
          if (usuarioPwdLDAPRequestResponse.estadoOperacionDTO.estadoTransaccion) {
            try {
              saveLog({
                level: customLevelsLog.levels.info,
                message: "Peticion recuperacion admin contrasena",

                data: {
                  file: "passwordRecover.js",
                  function: "requestPasswordRecoverAdminUsers",
                  ip: data.sourceIP,
                  User: usuario.loginName,
                  result: true
                },
              })
              let mailXXX = "xxxxxxx" + UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.email.slice(5, UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.email.length);
              let dataMail = {
                NombreCompleto: usuario.nombre + " " + usuario.apellido,
                usuarioCC: usuario.samaccountName,
                password: usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password,
                lblLink: 'INGRESO PORTAL',
                LinkportalIntermediario: URL_PORTAL,
              }
              var mail = await sendEmail(
                usuario.email,
                SUBJECTMAIL.PASSWORDRECOVER,
                dataMail
              );

              return { mensaje: mail.response, mail: mailXXX, changePassword: true };

            } catch (err) {
              saveLog({
                level: customLevelsLog.levels.error,
                message: "Peticion recuperacion contrasena",

                data: {
                  file: "passwordRecover.js",
                  function: "requestPasswordRecoverAdminUsers -- usuarioPwdLDAPRequest",
                  ip: data.sourceIP,
                  User: usuario.loginName,
                  dataError: err
                },
              })
              console.log(JSON.stringify(err));
              return makeErrorResponse(err.message, 500);
            }
          } else {

            saveLog({
              level: customLevelsLog.levels.error,
              message: "Peticion recuperacion contrasena",

              data: {
                file: "passwordRecover.js",
                function: "requestPasswordRecoverAdminUsers -- usuarioPwdLDAPRequest",
                ip: data.sourceIP,
                User: usuario.loginName,
                dataError: usuarioPwdLDAPRequestResponse
              },
            })
            return makeErrorResponse("No se pudo actualizar " + JSON.stringify(usuarioPwdLDAPRequestResponse), 500);
          }
        }
        return makeErrorResponse("No se encontró usuario", 500);
      }
      return makeErrorResponse("No se encontró usuario", 500);
    }
    return makeErrorResponse("No se encontró usuario", 500);
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Peticion recuperacion contrasena",
      data: {
        file: "passwordRecover.js",
        function: "requestPasswordRecoverAdminUsers",
        ip: data.sourceIP,
        User: identification,
        dataError: err
      },
    })

    return makeErrorResponse(err.message, 500);
  }
};

module.exports = {
  requestPasswordRecover,
  requestPasswordRecoverAdminUsers
};
