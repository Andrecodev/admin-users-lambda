const { UsuarioLDAPRequestDTO, UserDto } = require("../models/login/dtos");
const { QueryUsers, QueryUser } = require("../models/querys/dtos");
const { usuarioEstadoLDAPRequestDTO, usuarioDelLDAPRequestDTO, baseUsuarioLDAPRequestDTO, usuarioIaxisRequestDTO } = require("../models/operationUser/dtos");

const setDataRequestUsuarioLDAP = (userData) => {
    const UsuarioLDAPRequest = { ...UsuarioLDAPRequestDTO };
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.loginName = userData.usuarioBasicoLDAPDTO.loginName;
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName = userData.usuarioBasicoLDAPDTO.distinguishedName;
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isGestor = userData.usuarioBasicoLDAPDTO.isGestor;
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isAdministrador = userData.usuarioBasicoLDAPDTO.isAdministrador;    
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.aplicacion = userData.nombreAplicacion;
    UsuarioLDAPRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.servidorExterno = userData.servidorExterno;
    return UsuarioLDAPRequest;
}

const setDataUsuarioLdapCollectionDtoToUser = (userData) => {

    const User = { ...UserDto };
    /* operacion =  Administrador = 1 Consulta = 2 Gestor = 3 GestorSarlaft = 4*/
    if (!userData.isGestor) {
        User.clave = userData.listaUsuarioApp[0].atributosPersonalizados.find(x => x.nombreAtributo === "clavePrincipal").valoresPersonalizados[0];
        User.claveshijas = userData.listaUsuarioApp[0].atributosPersonalizados.find(x => x.nombreAtributo === "clavesHijas").valoresPersonalizados;
        if (userData.isAdministrador) {
            User.operacion = 1;
        } else {
            User.operacion = 2;
        }
    } else {
        User.operacion = 3;
    }

    User.tipoid = userData.tipoDocumento;
    User.numeroid = userData.numeroDocumento;
    User.email = userData.email;
    User.usuario = userData.samaccountName;
    User.name = userData.loginName;
    User.modulos = "[Productos,Consultas,Mis negocios,Mis solicitudes,Servicios en Linea,Crece con Liberty,Comisiones,Cartera,Crear,Consultar,Sobrecomisiones,Solicitudes,Crear,Consultar,Sobrecomisiones,Validacion,Websockets]";
    User.app = "KnejyWxSdM2pJ4zLna0e0g%3d%3d";
    User.celular = userData.celular;
    User.isAdministrador = userData.isAdministrador;
    User.isValidado = userData.isValidado;
    User.isUsuarioActivo = userData.isUsuarioActivo;
    User.forzarModPassword = userData.forzarModPassword;
    User.passwordExpiro = userData.passwordExpiro;
    User.bloqueoLdap = userData.bloqueoLdap;
    User.oleoductoWeb = userData.oleoductoWeb;
    User.isGestor = userData.isGestor;
    return User;
}

const setDataQueryUsers = (data) => {
    var QueryUsersRequest = { ...QueryUsers };
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.nombre = data.name;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.apellido = data.lastName;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.email = data.email;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.numeroDocumento = data.number;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.atributosPersonalizados = setDataCustomAttributes([], "clavePrincipal", [data.broker]);
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.paginacionFilterDTO = setDataPagination(data.RequestPage, data.itemsForPage);
    return QueryUsersRequest;
}

const setDataForUser = (data) => {
    var QueryUsersRequest = { ...QueryUser };
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.loginName = data.usuarioBasicoLDAPDTO.loginName;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.distinguishedName = data.usuarioBasicoLDAPDTO.distinguishedName;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isAdministrador = data.usuarioBasicoLDAPDTO.isAdministrador;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.isGestor = data.usuarioBasicoLDAPDTO.isGestor;
    return QueryUsersRequest;
}

const setDataValidUser = (data) => {
    var QueryUsersRequest = { ...QueryUsers };
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.tipoDocumento = data.type;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.numeroDocumento = data.number;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.paginacionFilterDTO = setDataPagination(1, 10);
    return QueryUsersRequest;
}

const setDataValidNewUser = (data) => {
    var QueryUsersRequest = { ...QueryUsers };
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.tipoDocumento = data.type;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.numeroDocumento = data.number;
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.atributosPersonalizados = setDataCustomAttributes([], "clavePrincipal", [data.broker]);
    QueryUsersRequest.UsuarioLDAPRequestDTO.usuarioLDAPFilterDto.paginacionFilterDTO = setDataPagination(1, 1);
    return QueryUsersRequest;
}

const setDataUpdateStatusUser = (data) => {
    var usuarioEstadoLDAPRequest = { ...usuarioEstadoLDAPRequestDTO };
    usuarioEstadoLDAPRequest.UsuarioEstadoLDAPRequestDTO.usuarioEstadoLDAPDTO.deshabilitar = data.status;
    usuarioEstadoLDAPRequest.UsuarioEstadoLDAPRequestDTO.usuarioEstadoLDAPDTO.loginName = data.DistinguishedName;
    return usuarioEstadoLDAPRequest;



}

const setDataDeleteUser = (data) => {
    var usuarioDelLDAPRequest = { ...usuarioDelLDAPRequestDTO };
    usuarioDelLDAPRequest.UsuarioDelLDAPRequestDTO.usuarioDelLDAPDTO.loginName = data.DistinguishedName;
    return usuarioDelLDAPRequest;



}

const setlistaUsuarioApp = (data) => {
    return [{
        "atributosPersonalizados": [
            { "nombreAtributo": "clavePrincipal", "valoresPersonalizados": [data.Broker] },
            { "nombreAtributo": "likeToGetEmail", "valoresPersonalizados": ["False"] },
            { "nombreAtributo": "idIntermediario", "valoresPersonalizados": [data.BrokerData.nitNumber] },
            { "nombreAtributo": "nombreIntermediario", "valoresPersonalizados": [data.BrokerData.businessName] },
            { "nombreAtributo": "sucursalIntermediario", "valoresPersonalizados": [data.BrokerData.city] },
            { "nombreAtributo": "perfilIaxis", "valoresPersonalizados": data.perfilIaxis },
            { "nombreAtributo": "claveIaxis", "valoresPersonalizados": data.claveIaxis },
            { "nombreAtributo": "clavesHijas", "valoresPersonalizados": data.BrokerChilds }
        ],
        "gruposAplicacion": data.Features,
        "nombreAplicacion": "PortalIntermediarios"
    }]

}

const setlistaUsuarioAppGestor = (data) => {
    return [{
        "atributosPersonalizados": [],
        "gruposAplicacion": data.Features,
        "nombreAplicacion": "PortalIntermediarios"
    }]

}

const setDataCreateUser = (data) => {
    var baseUsuarioLDAPRequest = { ...baseUsuarioLDAPRequestDTO };
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = data.loginName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.uidUsuario = data.uidUsuario;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.samaccountName = data.samaccountName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.nombre = data.Names;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.apellido = data.LastNames;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.email = data.Mail;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.telefonoFijo = data.Telephone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.tipoDocumento = data.TypeDocument;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.numeroDocumento = data.NumberId;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.celular = data.Cellphone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.oleoductoWeb = data.oleoductoWeb;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.descripcion = data.descripcion;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.listaUsuarioApp = setlistaUsuarioApp(data);
    return baseUsuarioLDAPRequest;
}


const setDataCreateUserGestor = (data) => {
    var baseUsuarioLDAPRequest = { ...baseUsuarioLDAPRequestDTO };
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = data.loginName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.uidUsuario = data.uidUsuario;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.samaccountName = data.samaccountName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.nombre = data.Names;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.apellido = data.LastNames;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.email = data.Mail;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.telefonoFijo = data.Telephone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.tipoDocumento = data.TypeDocument;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.numeroDocumento = data.NumberId;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.celular = data.Cellphone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.oleoductoWeb = data.oleoductoWeb;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.descripcion = data.descripcion;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.listaUsuarioApp = setlistaUsuarioAppGestor(data);
    return baseUsuarioLDAPRequest;
}

const setDataUpdateUser = (data, UserLDAP) => {
    var baseUsuarioLDAPRequest = { ...baseUsuarioLDAPRequestDTO };
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = data.loginName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.uidUsuario = data.uidUsuario;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.samaccountName = data.samaccountName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.nombre = data.Names;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.apellido = data.LastNames;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.email = data.Mail;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.telefonoFijo = data.Telephone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.tipoDocumento = data.TypeDocument;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.numeroDocumento = data.NumberId;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.celular = data.Cellphone;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.oleoductoWeb = data.oleoductoWeb;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.descripcion = data.descripcion;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isValidado = UserLDAP.isValidado;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isUsuarioActivo = UserLDAP.isUsuarioActivo;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.forzarModPassword = UserLDAP.forzarModPassword;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.passwordExpiro = UserLDAP.passwordExpiro;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.bloqueoLdap = UserLDAP.bloqueoLdap;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.oleoductoWeb = UserLDAP.oleoductoWeb;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.proximoVencer = UserLDAP.proximoVencer;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.distinguishedName = UserLDAP.distinguishedName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isGestor = UserLDAP.isGestor;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.isAdministrador = UserLDAP.isAdministrador;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.loginName = UserLDAP.loginName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.uidUsuario = UserLDAP.uidUsuario;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.samaccountName = UserLDAP.samaccountName;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.tipoDocumento = UserLDAP.tipoDocumento;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.numeroDocumento = UserLDAP.numeroDocumento;
    baseUsuarioLDAPRequest.BaseUsuarioLDAPRequestDTO.usuarioLDAPDTO.listaUsuarioApp = setlistaUsuarioApp(data);
    return baseUsuarioLDAPRequest;
}


const setDataCreateUserIAXIS = (data) => {
    var usuarioIaxisCreateRequestDTO = { ...usuarioIaxisRequestDTO };
    usuarioIaxisCreateRequestDTO.cedula = data.descripcion;
    usuarioIaxisCreateRequestDTO.nombre = data.loginName;
    usuarioIaxisCreateRequestDTO.usuariored = data.descripcion;
    usuarioIaxisCreateRequestDTO.clavered = data.password;
    usuarioIaxisCreateRequestDTO.oficina = "Colombia/" + data.BrokerData.city.trim() + "/Oleoducto";
    usuarioIaxisCreateRequestDTO.telefono = data.Telephone;
    usuarioIaxisCreateRequestDTO.mail = data.Mail;
    usuarioIaxisCreateRequestDTO.sucursal = data.BrokerData.officeCode;
    usuarioIaxisCreateRequestDTO.ciudad = data.BrokerData.city.trim();
    usuarioIaxisCreateRequestDTO.departamento = data.BrokerData.departmentCode;
    usuarioIaxisCreateRequestDTO.cargo = data.Cargo;
    usuarioIaxisCreateRequestDTO.dirreccion = "Sin data";
    usuarioIaxisCreateRequestDTO.company = data.Compania;
    usuarioIaxisCreateRequestDTO.codigoagente = data.claveIaxis;
    usuarioIaxisCreateRequestDTO.perfil = data.perfilIaxis;
    return usuarioIaxisCreateRequestDTO;



}




const setDataPagination = (paginaSolicitada, registrosPagina) => {
    return {
        paginaSolicitada: paginaSolicitada,
        paginaSolicitadaSpecified: true,
        registrosPagina: registrosPagina,
        registrosPaginaSpecified: true

    }
}

const setDataCustomAttributes = (data, key, value) => {
    data.push({ "nombreAtributo": key, "valoresPersonalizados": value })
    return data;
}

module.exports = {
    setDataCreateUser,
    setDataRequestUsuarioLDAP,
    setDataUsuarioLdapCollectionDtoToUser,
    setDataQueryUsers,
    setDataValidUser,
    setDataUpdateStatusUser,
    setDataDeleteUser,
    setDataCreateUserIAXIS,
    setDataUpdateUser,
    setDataValidNewUser,
    setDataForUser,
    setDataCreateUserGestor,
};
