const VALIDAR_EXISTENCIA_USUARIO_LDAP = {
  "StatusCode": 200,
  "ExecutedVersion": "$LATEST",
  "Payload": "{\"status\":{\"code\":200,\"details\":\"ok\"},\"data\":{\"infoResponse\":{\"infoResponse\":{\"codigoEstado\":\"0\",\"descripcion\":\"Proceso Terminado Correctamente\",\"error\":false,\"requestId\":\"\",\"severidad\":\"INFO\"},\"usuarioBasicoLDAPDTO\":{\"loginName\":\"Test, Batman (Colombia)\",\"uidUsuario\":\"33d37125-b138-4d8f-a2e3-39899368b4b1\",\"samaccountName\":\"CC12345500\",\"nombre\":\"Pruebas\",\"apellido\":\"QA\",\"email\":\"jairo.becerra@outsourcing.libertycolombia.com\",\"telefonoFijo\":\"59685445\",\"tipoDocumento\":\"CC\",\"numeroDocumento\":\"12345500\",\"celular\":\"3214220349\",\"isAdministrador\":false,\"servidorExterno\":false,\"isValidado\":true,\"isUsuarioActivo\":true,\"forzarModPassword\":false,\"passwordExpiro\":false,\"bloqueoLdap\":false,\"proximoVencer\":false,\"distinguishedName\":\"CN=Test\\\\, Batman (Colombia),OU=Oleoductos,OU=PREP,DC=libertycolombia,DC=com\",\"isGestor\":true,\"existeAsociacion\":true,\"atributosPersonalizados\":[{\"nombreAtributo\":\"sucursalIntermediario\",\"valoresPersonalizados\":[\"LIBERTY SEGUROS S.A. AGENCIA ARMENIA\"]},{\"nombreAtributo\":\"nombreIntermediario\",\"valoresPersonalizados\":[\"prueba test hogar\"]},{\"nombreAtributo\":\"likeToGetEmail\",\"valoresPersonalizados\":[\"False\"]},{\"nombreAtributo\":\"idIntermediario\",\"valoresPersonalizados\":[\"9006570567\"]},{\"nombreAtributo\":\"clavesHijas\",\"valoresPersonalizados\":[\"90833\"]},{\"nombreAtributo\":\"clavePrincipal\",\"valoresPersonalizados\":[\"90833\"]},{\"nombreAtributo\":\"claveIaxis\",\"valoresPersonalizados\":[\"4090833\"]}],\"usuarioInterno\":false}}}}"
};

const CONSULTAR_USUARIO = {
  "StatusCode": 200,
  "ExecutedVersion": "$LATEST",
  "Payload": "{\"status\":{\"code\":200,\"details\":\"ok\"},\"data\":{\"infoResponse\":{\"infoResponse\":{\"codigoEstado\":\"0\",\"descripcion\":\"Proceso Terminado Correctamente\",\"error\":false,\"requestId\":\"\",\"severidad\":\"INFO\"},\"usuarioInterno\":false,\"usuarioLdapCollectionDto\":{\"paginacionResponseDTO\":{\"totalRegistros\":1,\"paginaActual\":1,\"registrosPagina\":10,\"cantidadPaginas\":1},\"listaUsuarioLdap\":[{\"loginName\":\"Test, Batman (Colombia)\",\"uidUsuario\":\"33d37125-b138-4d8f-a2e3-39899368b4b1\",\"samaccountName\":\"CC12345500\",\"nombre\":\"Pruebas\",\"apellido\":\"QA\",\"email\":\"jairo.becerra@outsourcing.libertycolombia.com\",\"telefonoFijo\":\"59685445\",\"tipoDocumento\":\"CC\",\"numeroDocumento\":\"12345500\",\"celular\":\"3214220349\",\"isAdministrador\":false,\"servidorExterno\":false,\"isValidado\":true,\"isUsuarioActivo\":true,\"forzarModPassword\":false,\"passwordExpiro\":false,\"bloqueoLdap\":false,\"oleoductoWeb\":\"OL\",\"proximoVencer\":false,\"distinguishedName\":\"CN=Test\\\\, Batman (Colombia),OU=Oleoductos,OU=PREP,DC=libertycolombia,DC=com\",\"isGestor\":true,\"listaUsuarioApp\":[{\"atributosPersonalizados\":[{\"nombreAtributo\":\"sucursalIntermediario\",\"valoresPersonalizados\":[\"LIBERTY SEGUROS S.A. AGENCIA ARMENIA\"]},{\"nombreAtributo\":\"nombreIntermediario\",\"valoresPersonalizados\":[\"prueba test hogar\"]},{\"nombreAtributo\":\"likeToGetEmail\",\"valoresPersonalizados\":[\"False\"]},{\"nombreAtributo\":\"idIntermediario\",\"valoresPersonalizados\":[\"9006570567\"]},{\"nombreAtributo\":\"clavesHijas\",\"valoresPersonalizados\":[\"90833\"]},{\"nombreAtributo\":\"clavePrincipal\",\"valoresPersonalizados\":[\"90833\"]},{\"nombreAtributo\":\"claveIaxis\",\"valoresPersonalizados\":[\"4090833\"]}],\"gruposAplicacion\":[\"Consulta Siniestros\",\"Consulta Produccion\",\"Consulta Renovaciones\"],\"nombreAplicacion\":\"PortalIntermediarios\"}],\"aplicacionPrincipal\":false}]}}}}"
};

const RECOVER_PWD_LDAP = {
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '{"status":{"code":200,"details":"ok"},"data":{"infoResponse":{"infoResponse":{"codigoEstado":"0","descripcion":"Proceso Terminado Correctamente","error":false,"requestId":"","severidad":"INFO"},"estadoOperacionDTO":{"estadoTransaccion":true}}}}'
};

const CONSULTAR_USUARIOS = {
  "StatusCode": 200,
  "ExecutedVersion": "$LATEST",
  "Payload": { "status": { "code": 200, "details": "ok" }, "data": { "infoResponse": { "infoResponse": { "codigoEstado": "0", "descripcion": "Proceso Terminado Correctamente", "error": false, "requestId": "", "severidad": "INFO" }, "usuarioInterno": false, "usuarioLdapCollectionDto": { "paginacionResponseDTO": { "totalRegistros": 1, "paginaActual": 1, "registrosPagina": 10, "cantidadPaginas": 1 }, "listaUsuarioLdap": [{ "loginName": "Jose, Arias (Colombia)", "uidUsuario": "7b1403c7-c2b7-447d-9f7a-bf8c0d36bd91", "samaccountName": "cc1598423678", "nombre": "Carloss", "apellido": "Manchinnii", "email": "Daniela.Rodriguez@Outsourcing.Libertycolombia.com", "telefonoFijo": "3124857600", "tipoDocumento": "CC", "numeroDocumento": "1598423678", "celular": "3124857695", "isAdministrador": false, "servidorExterno": false, "isValidado": true, "isUsuarioActivo": true, "forzarModPassword": true, "passwordExpiro": false, "bloqueoLdap": false, "proximoVencer": false, "distinguishedName": "CN=Jose\\, Arias (Colombia),OU=Oleoductos,OU=DEV,DC=libertycolombia,DC=com", "isGestor": false, "listaUsuarioApp": [{ "atributosPersonalizados": [{ "nombreAtributo": "sucursalIntermediario", "valoresPersonalizados": ["BOGOTA, D.C."] }, { "nombreAtributo": "nombreIntermediario", "valoresPersonalizados": ["PROSEGUROS CORREDORES DE SEGUROS S.A."] }, { "nombreAtributo": "likeToGetEmail", "valoresPersonalizados": ["False"] }, { "nombreAtributo": "idIntermediario", "valoresPersonalizados": ["8600248586"] }, { "nombreAtributo": "clavesHijas", "valoresPersonalizados": ["123"] }, { "nombreAtributo": "clavePrincipal", "valoresPersonalizados": ["123"] }], "gruposAplicacion": ["Nuevo portal", "Usuario Consulta"], "nombreAplicacion": "PortalIntermediarios" }], "aplicacionPrincipal": false }, { "loginName": "Charles, Montiel (Colombia)", "uidUsuario": "879ea53e-c991-44b1-8438-5d37f6459b22", "samaccountName": "cc1598423677", "nombre": "Chales", "apellido": "Montiel", "email": "Daniela.Rodriguez@Outsourcing.Libertycolombia.com", "telefonoFijo": "3512004862 ext 15", "tipoDocumento": "CC", "numeroDocumento": "1598423677", "celular": "3512004862", "isAdministrador": false, "servidorExterno": false, "isValidado": true, "isUsuarioActivo": true, "forzarModPassword": false, "passwordExpiro": false, "bloqueoLdap": false, "proximoVencer": false, "distinguishedName": "CN=Charles\\, Montiel (Colombia),OU=Oleoductos,OU=DEV,DC=libertycolombia,DC=com", "isGestor": false, "listaUsuarioApp": [{ "atributosPersonalizados": [{ "nombreAtributo": "sucursalIntermediario", "valoresPersonalizados": ["BOGOTA, D.C."] }, { "nombreAtributo": "nombreIntermediario", "valoresPersonalizados": ["PROSEGUROS CORREDORES DE SEGUROS S.A."] }, { "nombreAtributo": "likeToGetEmail", "valoresPersonalizados": ["False"] }, { "nombreAtributo": "idIntermediario", "valoresPersonalizados": ["8600248586"] }, { "nombreAtributo": "clavesHijas", "valoresPersonalizados": ["2701"] }, { "nombreAtributo": "clavePrincipal", "valoresPersonalizados": ["123"] }], "gruposAplicacion": ["Usuario Consulta", "Nuevo portal"], "nombreAplicacion": "PortalIntermediarios" }], "aplicacionPrincipal": false }, { "loginName": "Carlos, Manchini (Colombia)", "uidUsuario": "8cccd7d4-06c5-4ce3-be87-0563f579e925", "samaccountName": "cc159842367", "nombre": "Carlos", "apellido": "Manchini", "email": "Daniela.Rodriguez@Outsourcing.Libertycolombia.com", "telefonoFijo": "3124857695", "tipoDocumento": "CC", "numeroDocumento": "159842367", "celular": "3124857695", "isAdministrador": false, "servidorExterno": false, "isValidado": true, "isUsuarioActivo": true, "forzarModPassword": true, "passwordExpiro": false, "bloqueoLdap": false, "proximoVencer": false, "distinguishedName": "CN=Carlos\\, Manchini (Colombia),OU=Oleoductos,OU=DEV,DC=libertycolombia,DC=com", "isGestor": false, "listaUsuarioApp": [{ "atributosPersonalizados": [{ "nombreAtributo": "sucursalIntermediario", "valoresPersonalizados": ["BOGOTA, D.C."] }, { "nombreAtributo": "nombreIntermediario", "valoresPersonalizados": ["PROSEGUROS CORREDORES DE SEGUROS S.A."] }, { "nombreAtributo": "likeToGetEmail", "valoresPersonalizados": ["False"] }, { "nombreAtributo": "idIntermediario", "valoresPersonalizados": ["8600248586"] }, { "nombreAtributo": "clavesHijas", "valoresPersonalizados": ["123"] }, { "nombreAtributo": "clavePrincipal", "valoresPersonalizados": ["123"] }], "gruposAplicacion": ["Usuario Consulta"], "nombreAplicacion": "PortalIntermediarios" }], "aplicacionPrincipal": false }] } } } }
}
const CHANGE_STATUS_USER_LDAP_DATA = {
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '{"status":{"code":200,"details":"ok"},"data":{"infoResponse":{"infoResponse":{"codigoEstado":"0","descripcion":"Proceso Terminado Correctamente","error":false,"requestId":"","severidad":"INFO"},"estadoOperacionDTO":{"estadoTransaccion":true}}}}'
};

const DELETE_USER_LDAP_DATA = {
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '{"status":{"code":200,"details":"ok"},"data":{"infoResponse":{"infoResponse":{"codigoEstado":"0","descripcion":"Proceso Terminado Correctamente","error":false,"requestId":"","severidad":"INFO"},"estadoOperacionDTO":{"estadoTransaccion":true}}}}'
};

const CREATE_USER_LDAP_DATA = {
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '{"status":{"code":200,"details":"ok"},"data":{"infoResponse":{"infoResponse":{"codigoEstado":"0","descripcion":"Proceso Terminado Correctamente","error":false,"requestId":"","severidad":"INFO"},"estadoOperacionDTO":{"estadoTransaccion":true}}}}'
};

const CREATE_USER_IAXIS_DATA = {
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: '{"status":{"code":200,"details":"ok"},"data":{"infoResponse":{"estado":{"codigoEstado":"1","codigoEstadoServidor":"0","descripcionEstado":"Usuario creado correctamente en LDAP - Usuario creado en iAXIS","severidad":"Info"}}}}'
};


module.exports = {
  VALIDAR_EXISTENCIA_USUARIO_LDAP,
  CONSULTAR_USUARIO,
  RECOVER_PWD_LDAP,
  CHANGE_STATUS_USER_LDAP_DATA,
  DELETE_USER_LDAP_DATA,
  CREATE_USER_LDAP_DATA,
  CREATE_USER_IAXIS_DATA,
  CONSULTAR_USUARIOS
};
