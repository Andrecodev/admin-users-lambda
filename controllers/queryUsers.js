const { makeErrorResponse } = require('../models/response');
const { queryUsersShema, queryUserShema } = require('../middleware/schemas/queryUser');
const { UsuarioExistLDAPRequestDTO, usuarioPwdLDAPRequestDTO } = require("../models/login/dtos");
const validatorHandler = require('../middleware/validator');
const {
  LDAP_NAME,
  CONSULT_USER,
  VERIFY_USER
} = require('../constants/soapOrchestrator');
const { setDataQueryUsers, setDataValidUser, setDataForUser } = require('../utils/DtoToEntity');
const getDataFromOrchestrator = require('./orchestrator');
//const { OK_DATA_LDAP_USER } = require('../models/response-templates');



const queryUsers = async (data) => {
  const loginValidator = validatorHandler(queryUsersShema, data);
  const isValid = typeof loginValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect queryUsers body ${validationError}`, 422);
  }
  try {
    let UsuarioLDAPRequest = setDataQueryUsers(data);
    const UsuarioLDAPRequestResponse = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: CONSULT_USER,
      body: UsuarioLDAPRequest,
    });
    return UsuarioLDAPRequestResponse;

  } catch (err) {
    console.log(JSON.stringify(err));
    return makeErrorResponse(err.message, 500);
  }
};



const dataForUser = async (data) => {
  const loginValidator = validatorHandler(queryUserShema, data);
  const isValid = typeof loginValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect queryUsers body ${validationError}`, 422);
  }

  const { type, number, sourceIP ,broker} = data;
  const identification = `${type}${number}`;

  const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion = identification;
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName = identification;

  const UsuarioExistRequestResponse = await getDataFromOrchestrator({
    soapName: LDAP_NAME,
    methodName: VERIFY_USER,
    body: UsuarioExistRequest,
  });
  //si encontro un usuario con ese cc
  if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO) {
    //console.log("UsuarioExistRequestResponse.usuarioBasicoLDAPDTO", UsuarioExistRequestResponse.usuarioBasicoLDAPDTO);

    
    let UsuarioLDAPRequest = setDataForUser(UsuarioExistRequestResponse);
    const UsuarioLDAPRequestResponse = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: CONSULT_USER,
      body: UsuarioLDAPRequest,
    });
    let usuarios = UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap ? UsuarioLDAPRequestResponse.usuarioLdapCollectionDto.listaUsuarioLdap : [];

    if (usuarios.length > 0) {
      //buscar en la lista de usuarios el que corresponda al distinguishedName de la peticion anterior
      //console.log("usuarios dataForUser ",usuarios);
      let usuario = null;
      //si es gestor solo se validad el distinguishedName
      if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.isGestor) {
        usuario = usuarios.find(x => x.distinguishedName === UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.distinguishedName);
      } else {
      //para los demas usuarios se validad que en la propiedad clavePrincipal se igual a broker enviada en el request
        usuario = usuarios.find(x => x.distinguishedName === UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.distinguishedName);
        //usuario = usuarios.find(x => x.distinguishedName === UsuarioExistRequestResponse.usuarioBasicoLDAPDTO.distinguishedName && x.listaUsuarioApp[0].atributosPersonalizados.find(y=>y.nombreAtributo === "clavePrincipal").valoresPersonalizados[0] === broker);
      }
      if (usuario) {
        return usuario;
      }
      return "no se encontro usuario";
    }
  }
}
const validUser = async (data) => {
  const loginValidator = validatorHandler(queryUserShema, data);
  const isValid = typeof loginValidator !== 'object';
  if (!isValid) {
    const validationError = JSON.stringify(loginValidator.details);
    return makeErrorResponse(`Incorrect queryUsers body ${validationError}`, 422);
  }

  const { type, number, sourceIP } = data;
  const identification = `${type}${number}`;

  const UsuarioExistRequest = UsuarioExistLDAPRequestDTO;
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.descripcion = identification;
  UsuarioExistRequest.UsuarioExistLDAPRequestDTO.usuarioExistLDAPFilterDto.loginName = identification;
  try {
    const UsuarioExistRequestResponse = await getDataFromOrchestrator({
      soapName: LDAP_NAME,
      methodName: VERIFY_USER,
      body: UsuarioExistRequest,
    });
    //si encontro un usuario con ese cc
    if (UsuarioExistRequestResponse.usuarioBasicoLDAPDTO) {
      return true;
    } else {
      return false
    }

  } catch (err) {
    console.log(JSON.stringify(err));
    return makeErrorResponse(err.message, 500);
  }
};

module.exports = {
  queryUsers,
  validUser,
  dataForUser
};
