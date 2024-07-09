
const { makeErrorResponse } = require('../models/response');

const { createUsersAdminShema, createUsersGestorShema } = require('../middleware/schemas/operationsUser');

const validatorHandler = require('../middleware/validator');
const { LDAP_NAME, IAXIS_NAME, UPDATE_USER_LDAP, CREATE_USER_IAXIS, PASSWORD_RECOVERY, VERIFY_USER, CREATE_USER_LDAP } = require('../constants/soapOrchestrator');
const { TIPOGESTIONIAXIS } = require('../constants/IAXIS');
const { SUBJECTMAIL } = require('../constants/Mail');
const { setDataCreateUser, setDataCreateUserIAXIS, setDataCreateUserGestor } = require('../utils/DtoToEntity');
const getDataFromOrchestrator = require('./orchestrator');
const { convertBrokerToBrokerIAXIS } = require("../utils/parsers");
const { getModulesToAdminAndGestor } = require("../utils/modulesInfo");
const { URL_PORTAL } = process.env;
const { generateUUID } = require('../utils/utils');
const { sendEmail } = require('../utils/mail');
const { usuarioPwdLDAPRequestDTO, UsuarioExistLDAPRequestDTO } = require('../models/login/dtos');
const generator = require('generate-password');
const { getBroker } = require("./invokeLambdas");
const { createUserModules } = require('./callDatabases');
const { saveLog, customLevelsLog } = require('../utils/log');

const setDataIaxis = async (data) => {
    data.TipoIaxis = "TipoGestionIaxis.UsuarioNuevo";
    data.perfilIaxis = "TD_COTWEB";
    data.claveIaxis = convertBrokerToBrokerIAXIS(data.Broker);
    data.Cargo = "Analista Oleoducto";
    data.Compania = "Liberty Seguros S.A.";
    data.isUserIaxis = true;
    return data;
}

const setDataBroker = async (data) => {
    data.BrokerData = await getBroker(data.Broker);
    return data;
}

const setDataBasicUser = async (data) => {
    data.uidUsuario = generateUUID;
    data.loginName = data.LastNames + ", " + data.Names + " (Colombia)";
    data.samaccountName = data.TypeDocument + data.NumberId;
    data.descripcion = data.TypeDocument + data.NumberId;
    data.password = generator.generate({ length: 16, numbers: true, symbols: true, excludeSimilarCharacters: true , exclude : "<.*?>"});
    return data;
}
//pendiente de pruebas por sericio de iaxis
//createUserAdmin
const createUserAdminIAxis  = async (data) => {    
    try {
        console.log(data);          
           
        let baseUsuarioIAXISRequestDTO = setDataCreateUserIAXIS(data);
        console.log("baseUsuarioIAXISRequestDTO -->", JSON.stringify(baseUsuarioIAXISRequestDTO));
        //primero se crear el usuario por iaxis el cual tambien lo crea en AD
        let estadoOperacionCreateIAXISResponseDTO = {}
        try {
            estadoOperacionCreateIAXISResponseDTO =   await getDataFromOrchestrator({
                soapName: IAXIS_NAME,
                methodName: CREATE_USER_IAXIS,
                body: baseUsuarioIAXISRequestDTO,
            }); 
            console.log(JSON.stringify("estadoOperacionCreateIAXISResponseDTO"), estadoOperacionCreateIAXISResponseDTO);
        } catch (error) {
            console.log(JSON.stringify(error));
        }         
        console.log(JSON.stringify("estadoOperacionCreateIAXISResponseDTO luego request"), estadoOperacionCreateIAXISResponseDTO);
       

    } catch (err) {
        console.error(JSON.stringify(err));
        return makeErrorResponse(err.message, 500);
    }
};


//crea al administrador sin pasar por iaxis 
/*verifica si existe en caso afirmativo lo devuel indicando que existe
 */

const updateNewUserAdmin = async (data) => {

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
        return makeErrorResponse("Error al updateNewUserAdmin intente mas tarde : " + JSON.stringify(estadoOperacionResponseDTO), 500);
    }
}
///normal sin iaxis


const createUserAdmin = async (data) => {
    const createUserAdminValidator = validatorHandler(createUsersAdminShema, data);
    const isValid = typeof createUserAdminValidator !== 'object';
    if (!isValid) {
        const validationError = JSON.stringify(createUserAdminValidator.details);
        return makeErrorResponse(`Incorrect createAdminUser body ${validationError}`, 422);
    }
    try {
        //settear data basica del usuario

        data = await setDataBroker(data);
        data = await setDataBasicUser(data);
        data = await setDataIaxis(data);
        let UserLDAP = await verifyUserCreateinLDAP(data);
        const userId = data.samaccountName.toLowerCase().trim();
        if (UserLDAP !== null) {
            console.log("El usuario: " + userId + " ya existe");
            return makeErrorResponse("El usuario: " + userId + " ya existe", 500);
        }
        //el setteo de datos aplica tanto para crear y actulizar usuario en LDAP
        let Modules = await getModulesToAdminAndGestor();
        data.Features = []
        data.Features.push("Nuevo portal");
        data.Features.push("Usuario Administrador");
        let baseUsuarioLDAPRequestDTO = setDataCreateUser(data);
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isAdministrador = false;
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.USUARIONUEVO;
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.primeraVez = true;
        console.log("USUARIONUEVO admin", baseUsuarioLDAPRequestDTO);
        const estadoOperacionResponseDTO = await getDataFromOrchestrator({
            soapName: LDAP_NAME,
            methodName: CREATE_USER_LDAP,
            body: baseUsuarioLDAPRequestDTO,
        });

        if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
            //si se creo el usuario con exito
            if (estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion) {
               
                let UserLDAPVerified = await verifyUserCreateinLDAP(data);
                console.log("UserLDAPVerified admin", UserLDAPVerified);
                if (UserLDAPVerified !== null) {
                    
                    baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAPVerified.distinguishedName;
                    baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.USUARIONUEVO;
                    //se actualiza el valor is adminsitrador en el usuario creado anteriormente
                    baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isAdministrador = true;
                    await updateNewUserAdmin(baseUsuarioLDAPRequestDTO);
                    //sin esta propiedad no se puede actulizar el password para el usuario
                    data.distinguishedName = UserLDAPVerified.distinguishedName;
                    await addModulesUser({ userId, modules: Modules });
                    await updatePasswordNewUser(data);
                    saveLog({
                        level: customLevelsLog.levels.info,
                        message: "Usuario administrador creado correctamente",
                        data: {
                          file: "operationsToUserTransversal.js",
                          function: "createUserAdmin",
                          ip: data?.sourceIP,
                          user: userId,
                          dataToCreate: baseUsuarioLDAPRequestDTO          
                        },
                      })
                    createUserAdminIAxis(data);
                    

                    return { mensaje: "Usuario creado correctamente", create: true };
                }
            }
        }
        else {
            return makeErrorResponse("Error al createUserAdmin intente mas tarde" + JSON.stringify(estadoOperacionResponseDTO), 500);
        }

    } catch (err) {
        console.log(JSON.stringify(err));
        return makeErrorResponse(err.message, 500);
    }
};


const createGestor = async (data) => {
    const createUserGestorValidator = validatorHandler(createUsersGestorShema, data);
    const isValid = typeof createUserGestorValidator !== 'object';
    if (!isValid) {
        const validationError = JSON.stringify(createUserGestorValidator.details);
        return makeErrorResponse(`Incorrect createGestorUser body ${validationError}`, 422);
    }
    try {
        //settear data basica del usuario
        data = await setDataBasicUser(data);
        const userId = data.samaccountName.toLowerCase().trim();
        let UserLDAP = await verifyUserCreateinLDAP(data);
        console.log("UserLDAP gestor", JSON.stringify(UserLDAP));
        if (UserLDAP == null) {
            console.log("El usuario: " + userId + "no existe debe tener el numero de CC asociado la propiedad description en el AD");
            return makeErrorResponse("El usuario: " + userId + " no existe debe tener el numero de CC asociado la propiedad description en el AD", 500);
        }
        //el setteo de datos aplica tanto para crear y actulizar usuario en LDAP
        let Modules = await getModulesToAdminAndGestor();
        data.Features = []
        data.Features.push("Nuevo portal");
        data.Features.push("Usuario Gestor");
        let baseUsuarioLDAPRequestDTO = setDataCreateUserGestor(data);
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.primeraVez = true;
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isGestor = true;
        //se debe volver a settear estos datos, estos datos no cambian en el tiempo
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAP.distinguishedName;
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isIAXIS = TIPOGESTIONIAXIS.SINACCION;
        baseUsuarioLDAPRequestDTO.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = UserLDAP.loginName;
        data.distinguishedName = UserLDAP.distinguishedName;
        console.log("baseUsuarioLDAPRequestDTO gestor", JSON.stringify(baseUsuarioLDAPRequestDTO));
        await updateNewUser(baseUsuarioLDAPRequestDTO);
        await addModulesUser({ userId, modules: Modules });
        saveLog({
            level: customLevelsLog.levels.info,
            message: "Usuario gestor creado correctamente",
            data: {
              file: "operationsToUserTransversal.js",
              function: "createGestor",
              ip: data?.sourceIP,
              user: userId,
              dataToCreate: baseUsuarioLDAPRequestDTO          
            },
          })
        let dataMail = {
            NombreCompleto: data.Names + " " + data.LastNames,
            usuarioCC: data.TypeDocument + " " + data.NumberId,
            lblLink: 'Verificacion de usuario',
            LinkportalIntermediario: URL_PORTAL,

        }
        var mail = await sendEmail(
            data.Mail,
            SUBJECTMAIL.NEWGESTOR,
            dataMail
        );

        return { mensaje: mail.response, email: data.Mail, creacion: true };
    } catch (err) {
        console.log(JSON.stringify(err));
        return makeErrorResponse(err.message, 500);
    }
};


const verifyUserCreateinLDAP = async (data) => {
    const { TypeDocument, NumberId } = data;
    const identification = `${TypeDocument}${NumberId}`;
    const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
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

    let usuarioPwdLDAPRequest = usuarioPwdLDAPRequestDTO;
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
                message: "Update password to the new user",
                data: {
                  file: "operationsToUserTransversal.js",
                  function: "updatePasswordNewUser",
                  ip: data?.sourceIP,
                  user: data?.TypeDocument + " " + data?.NumberId,
                  dataToCreate: data          
                },
              })

            return { mensaje: mail.response, email: data.Mail, creacion: true };
        } catch (err) {
            console.log(JSON.stringify(err));
            
            return makeErrorResponse(err, 500);
        }
    } else {
        return makeErrorResponse("Error al updatePasswordNewUser intente mas tarde" + JSON.stringify(usuarioPwdLDAPRequestResponse), 500);
    }
}

const addModulesUser = async ({ userId, modules }) => {
    const response = await createUserModules({ userId, modules });
    saveLog({
        level: customLevelsLog.levels.info,
        message: "Add modules to the user",
        data: {
          file: "operationsToUserTransversal.js",
          function: "addModulesUser",
          ip: response?.sourceIP,
          user: userId,
          dataToCreate: modules          
        },
      })
    return response;
}


const updateNewUser = async (data) => {
console.log("updateNewUser", JSON.stringify(data));
    const estadoOperacionResponseDTO = await getDataFromOrchestrator({
        soapName: LDAP_NAME,
        methodName: UPDATE_USER_LDAP,
        body: data,
    });
    if (estadoOperacionResponseDTO.estadoOperacionDTO !== undefined) {
        //si se actulizo el usuario con exito
        if (estadoOperacionResponseDTO.estadoOperacionDTO.estadoTransaccion == 0) {
            saveLog({
                level: customLevelsLog.levels.info,
                message: "Se actualizo el usuario con exito",
                data: {
                  file: "operationsToUserTransversal.js",
                  function: "updateNewUser",
                  ip: data?.sourceIP,
                  user: data?.TypeDocument + " " + data?.NumberId,
                  dataToCreate: data          
                },
              })
            return true;
        } else { return false };
    } else {
        saveLog({
            level: customLevelsLog.levels.error,
            message: "Error al updateNewUser intente mas tarde",
            data: {
              file: "operationsToUserTransversal.js",
              function: "updateNewUser",
              ip: data?.sourceIP,
              user: data?.TypeDocument + " " + data?.NumberId,
              dataToCreate: data          
            },
          })
        return makeErrorResponse("Error al updateNewUser intente mas tarde" + JSON.stringify(estadoOperacionResponseDTO), 500);
    }
}


module.exports = {
    createUserAdmin,
    createGestor
};
