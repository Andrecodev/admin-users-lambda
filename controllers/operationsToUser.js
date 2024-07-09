const { makeErrorResponse } = require('../models/response');

const { blockUsersShema, deleteUsersShema, createUsersShema,
  queryModulesUserSchema, updateUsersShema } = require('../middleware/schemas/operationsUser');

const validatorHandler = require('../middleware/validator');
const { LDAP_NAME, IAXIS_NAME, CHANGE_STATUS_USER_LDAP, DELETE_USER_LDAP, CREATE_USER_LDAP,
  UPDATE_USER_LDAP, CREATE_USER_IAXIS, PASSWORD_RECOVERY, VERIFY_USER, CONSULT_USER } = require('../constants/soapOrchestrator');
const { TIPOGESTIONIAXIS } = require('../constants/IAXIS');
const { SUBJECTMAIL } = require('../constants/Mail');
const { UsuarioExistLDAPRequestDTO, UsuarioLDAPRequestDTO, UserDto } = require("../models/login/dtos");
const { setDataUpdateStatusUser, setDataDeleteUser, setDataCreateUser, setDataUpdateUser,
  setDataRequestUsuarioLDAP, setDataValidUser, setDataValidNewUser, setDataCreateUserIAXIS } = require('../utils/DtoToEntity');
const getDataFromOrchestrator = require('./orchestrator');
const { convertBrokerToBrokerIAXIS } = require("../utils/parsers");
const { generateUUID } = require('../utils/utils');
const { saveLog, customLevelsLog } = require('../utils/log');
const { sendEmail } = require('../utils/mail');
const { usuarioPwdLDAPRequestDTO } = require('../models/login/dtos');
const generator = require('generate-password');
const { getBroker } = require("./invokeLambdas");
const { URL_PORTAL } = process.env;

const { createUserModules, updateModulesPerUser, getUserModules } = require('./callDatabases');

const changeStatusUser = async (data) => {
  const blockUserValidator = validatorHandler(blockUsersShema, data);
  const isValid = typeof blockUserValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(blockUserValidator.details);
    return makeErrorResponse(`Incorrect changeStatusUser body ${validationError}`, 422);
  }
  try {
    let usuarioEstadoLDAPRequestDTO = setDataUpdateStatusUser(data);
    const estadoOperacionResponseDTO = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: CHANGE_STATUS_USER_LDAP,
      body: usuarioEstadoLDAPRequestDTO,
    });

    if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
      return estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion;
    }
    else {
      return false;
    }

  } catch (err) {
    console.log(JSON.stringify(err));
    return makeErrorResponse(err.message, 500);
  }
};

const deleteUser = async (data) => {
  const DeleteUserValidator = validatorHandler(deleteUsersShema, data);
  const isValid = typeof DeleteUserValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(DeleteUserValidator.details);
    return makeErrorResponse(`Incorrect deleteUser body ${validationError}`, 422);
  }
  try {
    let usuarioDelLDAPRequest = setDataDeleteUser(data);
    const estadoOperacionResponseDTO = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: DELETE_USER_LDAP,
      body: usuarioDelLDAPRequest,
    });
    if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
      return estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion;
    }
    else {
      return false;
    }


  } catch (err) {
    console.log(JSON.stringify(err));
    return makeErrorResponse(err.message, 500);
  }
};

const setDataIaxis = async (data) => {
  let isIaxis = false;
  data.Features.forEach((item) => {
    isIaxis = item.includes("cotizador");
  });
  data.TipoIaxis = "TipoGestionIaxis.UsuarioNuevo";
  data.perfilIaxis = "TD_COTWEB";
  data.claveIaxis = convertBrokerToBrokerIAXIS(data.Broker);
  data.Cargo = "Analista Oleoducto";
  data.Compania = "Liberty Seguros S.A.";
  data.isUserIaxis = isIaxis;
  return data;
}

const setDataBroker = async (data) => {
  data.BrokerData = await getBroker(data.Broker);
  return data;
}

const setDataBrokerGestor = (data) => {
  data.BrokerData = {};
  data.BrokerData.nitNumber = null;
  data.BrokerData.businessName = null;
  data.BrokerData.city = null;
  data.Broker = null;
  data.claveIaxis = null;
  data.BrokerChilds = [null];
  return data;
}

const setDataBasicUser = async (data) => {
  data.uidUsuario = generateUUID;
  data.loginName = data.LastNames + ", " + data.Names + " (Colombia)";
  data.samaccountName = data.TypeDocument + data.NumberId;
  data.descripcion = data.TypeDocument + data.NumberId;
  data.password = generator.generate({ length: 16, numbers: true, symbols: true, excludeSimilarCharacters: true, exclude: "<.*?>" });
  return data;
}
/*verifica si tiene un modulo iaxis
  si tiene modulo lo crea en iaxis y actuliza las propiedades en el LDAP y password
  si no tiene modulo iaxis crea el usuario y actiliza propiedades y password*/
const createUser = async (data) => {
  const createUserValidator = validatorHandler(createUsersShema, data);

  const isValid = typeof createUserValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(createUserValidator.details);
    return makeErrorResponse(`Incorrect createUser body ${validationError}`, 422);
  }
  try {
    //settear data basica del usuario

    data = await setDataBroker(data);
    data = await setDataBasicUser(data);
    data = await setDataIaxis(data);
    const userId = data.samaccountName.toLowerCase().trim();
    let UserLDAPFirst = await verifyUserCreateinLDAP(data);
    console.log("UserLDAP gestor", UserLDAPFirst);
    if (UserLDAPFirst !== null) {
      console.log("El usuario: " + userId + " ya existe");
      return makeErrorResponse("El usuario: " + userId + " ya existe", 500);
    }
    //el setteo de datos aplica tanto para crear y actulizar usuario en LDAP
    let Modules = [...data.Features];
    data.Features = []
    data.Features.push("Nuevo portal");
    data.Features.push("Usuario Consulta");
    console.log(data.Features);
    let baseUsuarioLDAPRequestDTO = setDataCreateUser(data);
    if (data.isUserIaxis) {
      let baseUsuarioIAXISRequestDTO = setDataCreateUserIAXIS(data);
      //crear usuario en IAXIS
      const estadoOperacionCreateIAXISResponseDTO = await getDataFromOrchestrator({
        soapName: IAXIS_NAME,
        methodName: CREATE_USER_IAXIS,
        body: baseUsuarioIAXISRequestDTO,
      });
      if (estadoOperacionCreateIAXISResponseDTO.estado.codigoEstado !== undefined) {
        if (estadoOperacionCreateIAXISResponseDTO.estado.codigoEstado == '1' && estadoOperacionCreateIAXISResponseDTO.estado.descripcionEstado == 'Usuario creado correctamente en LDAP - Usuario creado en iAXIS') {
          let UserLDAP = await verifyUserCreateinLDAP(data);
          if (UserLDAP) {
            baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAP.distinguishedName;
            baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.USUARIONUEVO;
            baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAP.distinguishedName;
            data.distinguishedName = UserLDAP.distinguishedName;
            await updateNewUser(baseUsuarioLDAPRequestDTO);
            console.log(Modules);
            await addModulesUser({ userId, modules: Modules });
            await updatePasswordNewUser(data);
            saveLog({
              level: customLevelsLog.levels.info,
              message: "Usuario creado correctamente",
              data: {
                from : data?.From || "Portal Office online",
                file: "operationsToUser.js",
                function: "createUser",
                ip: data?.sourceIP,
                user: userId,

              },
            })
            return { mensaje: "Usuario creado correctamente", create: true };

          } else {
            saveLog({
              level: customLevelsLog.levels.error,
              message: "Error al crear usuario intente mas tarde",
              data: {
                file: "operationsToUser.js",
                function: "createUser",
                ip: data?.sourceIP,
                user: userId,
              },
            })
            return makeErrorResponse("Error al crear usuario intente mas tarde", 500);

          }
        }
      } else {
        saveLog({
          level: customLevelsLog.levels.error,
          message: "Error al crear usuario intente mas tarde",
          data: {
            file: "operationsToUser.js",
            function: "createUser",
            ip: data?.sourceIP,
            user: userId,
          },
        })
        return makeErrorResponse("Error al crear usuario intente mas tarde", 500);
      }
    }
    //crear usuario normal 
    else {
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.SINACCION;
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.primeraVez = true;
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isValidado = false;
      console.log("baseUsuarioLDAPRequestDTO consulta usuario", JSON.stringify(baseUsuarioLDAPRequestDTO));
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isAdministrador = false;
      console.log("usuarioLDAPDTO crearUsuario", JSON.stringify(baseUsuarioLDAPRequestDTO));
      console.log("crear usuario");
      const estadoOperacionResponseDTO = await getDataFromOrchestrator({
        soapName: LDAP_NAME,
        methodName: CREATE_USER_LDAP,
        body: baseUsuarioLDAPRequestDTO,
      });

      if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
        //si se creo el usuario con exito
        if (estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion) {
          let UserLDAP = await verifyUserCreateinLDAP(data);
          if (UserLDAP) {
            data.distinguishedName = UserLDAP.distinguishedName;
            console.log("agregar modulos usuario");
            await addModulesUser({ userId, modules: Modules });
            console.log("Actulizar paswword");
            await updatePasswordNewUser(data);

            console.log("crear usuario iaxis");
            try {
              let baseUsuarioIAXISRequestDTO = setDataCreateUserIAXIS(data);
              const estadoOperacionCreateIAXISResponseDTO = getDataFromOrchestrator({
                soapName: IAXIS_NAME,
                methodName: CREATE_USER_IAXIS,
                body: baseUsuarioIAXISRequestDTO,
              });

              console.log("estadoOperacionCreateIAXISResponseDTO", JSON.stringify(estadoOperacionCreateIAXISResponseDTO));
            } catch (error) {
              console.error("usuarioLDAPDTO crearUsuario", JSON.stringify(error));
            }
            saveLog({
              level: customLevelsLog.levels.info,
              message: "Usuario creado correctamente",
              data: {
                file: "operationsToUser.js",
                function: "createUser",
                ip: data?.sourceIP,
                user: userId,
              },
            })
            return { mensaje: "Usuario creado correctamente", create: true };
          }
        }
      }
      else {
        saveLog({
          level: customLevelsLog.levels.error,
          message: "Error al crear el usuario intente mas tarde" + JSON.stringify(estadoOperacionResponseDTO),
          data: {
            file: "operationsToUser.js",
            function: "createUser",
            ip: data?.sourceIP,
            user: userId,
          },
        })
        return makeErrorResponse("Error al crear el usuario intente mas tarde" + JSON.stringify(estadoOperacionResponseDTO), 500);
      }
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Error al crear el usuario:: " + err.message,
      data: {
        file: "operationsToUser.js",
        function: "createUser",
        ip: data?.sourceIP,
        user: userId,
      },
    })
    return makeErrorResponse(err.message, 500);
  }
};

const verifyUserCreateinLDAP = async (data) => {
  var DataQueryUserAfterCreate = {
    type: data.TypeDocument,
    number: data.NumberId,
    broker: data.Broker
  };


  const identification = `${data.TypeDocument}${data.NumberId}`;

  const UsuarioExistRequest = { ...UsuarioExistLDAPRequestDTO };
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion = identification;
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName = identification;

  const UsuarioExistRequestResponse = await getDataFromOrchestrator({
    soapName: LDAP_NAME,
    methodName: VERIFY_USER,
    body: UsuarioExistRequest,
  });


  if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO) {
    return UsuarioExistRequestResponse.usuarioBasicoLDAPDTO;
  }
  return null;

}

const updatePasswordNewUser = async (data) => {

  let usuarioPwdLDAPRequest = { ...usuarioPwdLDAPRequestDTO };
  usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.loginName = data.distinguishedName;
  usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.password = data.password;
  //se manda forzarModPassword por ser creacion de usuario, y evitar que envie a modificar contraseña cuando se logue por primera vez
  usuarioPwdLDAPRequest.UsuarioPwdLDAPRequestDTO.usuarioPwdDTO.forzarModPassword = false;
  const usuarioPwdLDAPRequestResponse = await getDataFromOrchestrator({
    soapName: LDAP_NAME,
    methodName: PASSWORD_RECOVERY,
    body: usuarioPwdLDAPRequest,
  });
  if (usuarioPwdLDAPRequestResponse.estadoOperacionDTO.estadoTransaccion) {
    try {
      let dataMail = {
        NombreCompleto: data.Names + " " + data.LastNames,
        nombre_intermediario: data.BrokerData.businessName,
        textoCabecera: 'Se ha creado con éxito tu usuario de ingreso.',
        usuarioCC: data.TypeDocument + " " + data.NumberId,
        password: data.password,
        lblLink: 'Verificacion de usuario',
        LinkportalIntermediario: URL_PORTAL,

      }
      var mail = await sendEmail(
        data.Mail,
        SUBJECTMAIL.NEWUSER,
        dataMail
      );

      saveLog({
        level: customLevelsLog.levels.info,
        message: { mensaje: mail.response, email: data.Mail, creacion: true },
        data: {
          file: "updatePasswordNewUser.js",
          function: "createUser",
          ip: data?.sourceIP,
          user: data.TypeDocument + " " + data.NumberId,
        },
      })

      return { mensaje: mail.response, email: data.Mail, creacion: true };
    } catch (err) {
      console.log(JSON.stringify(err));
      saveLog({
        level: customLevelsLog.levels.error,
        message: err,
        data: {
          file: "updatePasswordNewUser.js",
          function: "createUser",
          ip: data?.sourceIP,
          user: data.TypeDocument + " " + data.NumberId,
        },
      })
      return makeErrorResponse(err, 500);
    }
  } else {
    console.log(JSON.stringify(usuarioPwdLDAPRequestResponse));
    saveLog({
      level: customLevelsLog.levels.error,
      message: { error: usuarioPwdLDAPRequestResponse, code: 500 },
      data: {
        file: "updatePasswordNewUser.js",
        function: "createUser",
        ip: data?.sourceIP,
        user: data.TypeDocument + " " + data.NumberId,
      },
    })
    return makeErrorResponse(usuarioPwdLDAPRequestResponse, 500);
  }
}

const addModulesUser = async ({ userId, modules }) => {
  try {
    const response = await createUserModules({ userId, modules });
    saveLog({
      level: customLevelsLog.levels.info,
      message: response,
      data: {
        file: "operationsToUser.js",
        function: "addModulesUser",

        user: userId,
      },
    })
    return response;
  } catch (error) {
    saveLog({
      level: customLevelsLog.levels.error,
      message: error,
      data: {
        file: "operationsToUser.js",
        function: "addModulesUser",
        user: userId, modules
      },
    })
  }


}

const updateModulesUser = async ({ userId, modules }) => {
  const response = await updateModulesPerUser({ userId, modules });
  saveLog({
    level: customLevelsLog.levels.info,
    message: response,
    data: {
      file: "operationsToUser.js",
      function: "updateModulesUser",
      user: userId,
    },
  })
  return response;
}
/*primero se busca el usuario
  si encuentra usuario, verifica si tiene un modulo iaxis
  si tiene modulo lo crea en iaxis y actuliza las propiedades en el LDAP
  si no tiene modulo iaxis actuliza propiedades*/
const updateUser = async (data) => {
  const updateUserValidator = validatorHandler(updateUsersShema, data);
  const isValid = typeof updateUserValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(updateUserValidator.details);
    return makeErrorResponse(`Incorrect updateUser body ${validationError}`, 422);
  }
  try {
    //settear data basica del usuario
    let UserLDAPExist = await verifyUserCreateinLDAP(data);
    if (!UserLDAPExist) {
      saveLog({
        level: customLevelsLog.levels.error,
        message: UserLDAPExist,
        data: {
          file: "operationsToUser.js",
          function: "updateUser",
          ip: data?.sourceIP,
          user: data?.TypeDocument + " " + data?.NumberId,
        },
      })
      return makeErrorResponse("EL usuario no existe : " + data.TypeDocument + data.NumberId, 500);
    }
    data = await setDataBasicUser(data);
    if (UserLDAPExist.isGestor) {
      data = await setDataBrokerGestor(data);
    } else {
      data = await setDataBroker(data);
      data = await setDataIaxis(data);
    }
    const userId = data.samaccountName.toLowerCase().trim();
    let Modules = [...data.Features];
    data.Features = [];
    data.Features.push("Nuevo portal");
    data.Features.push("Usuario Consulta");
    UserLDAPExist.isValidado = data.Verified;
    //el setteo de datos aplica tanto para actulizar usuario en LDAP
    let baseUsuarioLDAPRequestDTO = setDataUpdateUser(data, UserLDAPExist);
    if (data.isUserIaxis) {

      let baseUsuarioIAXISRequestDTO = setDataCreateUserIAXIS(data);
      //crear usuario en IAXIS
      const estadoOperacionCreateIAXISResponseDTO = await getDataFromOrchestrator({
        soapName: IAXIS_NAME,
        methodName: CREATE_USER_IAXIS,
        body: baseUsuarioIAXISRequestDTO,
      });
      if (estadoOperacionCreateIAXISResponseDTO.estado.codigoEstado !== undefined) {
        if (estadoOperacionCreateIAXISResponseDTO.estado.codigoEstado == '1' && estadoOperacionCreateIAXISResponseDTO.estado.descripcionEstado == 'Usuario creado correctamente en LDAP - Usuario creado en iAXIS') {
          baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.AGREGAPORTAL;
          await updateNewUser(baseUsuarioLDAPRequestDTO);
          await updateModulesUser({ userId, modules: Modules });
          saveLog({
            level: customLevelsLog.levels.info,
            message: "Usuario actualizado correctamente",
            data: {
              file: "operationsToUser.js",
              function: "updateUser",
              ip: data?.sourceIP,
              user: data?.TypeDocument + " " + data?.NumberId,
            },
          })
          return { mensaje: "Usuario actualizado correctamente", update: true };
        }
      } else {
        saveLog({
          level: customLevelsLog.levels.error,
          message: "Error al actulizar usuario intente mas tarde Iaxis" + JSON.stringify(estadoOperacionCreateIAXISResponseDTO),
          data: {
            file: "operationsToUser.js",
            function: "updateUser",
            ip: data?.sourceIP,
            user: data?.TypeDocument + " " + data?.NumberId,
          },
        })
        return makeErrorResponse("Error al actulizar usuario intente mas tarde Iaxis" + JSON.stringify(estadoOperacionCreateIAXISResponseDTO), 500);
      }
    } else {
      //se debe volver a settear estos datos, estos datos no cambian en el tiempo
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.SINACCION;
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = UserLDAPExist.loginName;
      baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAPExist.distinguishedName;
      const estadoOperacionResponseDTO = await getDataFromOrchestrator({
        soapName: LDAP_NAME,
        methodName: UPDATE_USER_LDAP,
        body: baseUsuarioLDAPRequestDTO,
      });
      if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
        //si se creo el usuario con exito
        if (estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion) {
          await updateModulesUser({ userId, modules: Modules });
          saveLog({
            level: customLevelsLog.levels.info,
            message: "Usuario actualizado correctamente",
            data: {
              message: { msg: "Usuario actualizado correctamente", userId, modules: Modules },
              file: "operationsToUser.js",
              function: "updateUser",
              ip: data?.sourceIP,
              user: data?.TypeDocument + " " + data?.NumberId,
            },
          })
          return { mensaje: "Usuario actualizado correctamente", update: true };
        }
      }
      else {
        saveLog({
          level: customLevelsLog.levels.error,
          message: "Error al actulizar usuario intente mas tarde : " + JSON.stringify(estadoOperacionResponseDTO),
          data: {
            file: "operationsToUser.js",
            function: "updateUser",
            ip: data?.sourceIP,
            user: data?.TypeDocument + " " + data?.NumberId,
          },
        })
        return makeErrorResponse("Error al actulizar usuario intente mas tarde : " + JSON.stringify(estadoOperacionResponseDTO), 500);
      }
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Error en actualizar usuario",
      data: {
        file: "operationsToUser.js",
        function: "updateUser",
        ip: data?.sourceIP,
        error: err,
        user: data?.TypeDocument + " " + data?.NumberId,
      },
    })
    return makeErrorResponse(err.message, 500);
  }
};

const updateNewUser = async (data) => {

  const estadoOperacionResponseDTO = await getDataFromOrchestrator({
    soapName: LDAP_NAME,
    methodName: UPDATE_USER_LDAP,
    body: data,
  });
  if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
    //si se actulizo el usuario con exito
    if (estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion) {
      return true;
    } else { return false };
  } else {
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Error en actualizar usuario",
      data: {
        file: "operationsToUser.js",
        function: "updateNewUser",
        ip: data?.sourceIP,
        error: err,
        user: data?.TypeDocument + " " + data?.NumberId,
      },
    })
    return makeErrorResponse("Error al actulizar usuario intente mas tarde : " + JSON.stringify(estadoOperacionResponseDTO), 500);
  }
}

const queryUserModules = async (data) => {
  const queryUserModules = validatorHandler(queryModulesUserSchema, data);
  const isValid = typeof queryUserModules !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(queryUserModules.details);
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Error Incorrect queryUsers body ",
      data: {
        file: "operationsToUser.js",
        function: "queryUserModules",
        ip: data?.sourceIP,
        user: data?.TypeDocument + " " + data?.NumberId,
      },
    })
    return makeErrorResponse(`Incorrect queryUsers body ${validationError}`, 422);
  }

  try {
    const identification = data.identification.toLowerCase().trim();
    const { modules = [] } = await getUserModules(identification);

    return modules;
  } catch (err) {
    console.log(JSON.stringify(err));
    saveLog({
      level: customLevelsLog.levels.error,
      message: "Error queryUserModules : " + err,
      data: {
        file: "operationsToUser.js",
        function: "queryUserModules",
        ip: data?.sourceIP,
        user: data?.TypeDocument + " " + data?.NumberId,
      },
    })
    return makeErrorResponse(err, 500);
  }
};

module.exports = {
  changeStatusUser,
  deleteUser,
  createUser,
  updateUser,
  queryUserModules

};
