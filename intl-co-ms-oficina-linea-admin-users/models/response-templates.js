const ERROR_RESPONSE_TEMPLATE = {
  status: {
    code: 500,
    details: "Error",
  }
};

const OK_RESPONSE_TEMPLATE = {
  status: {
    code: 200,
    details: "OK",
  }
};

const OK_DATA_LDAP_USER = {

  "status": {
    "code": 200,
    "details": "ok"
  },
  "data": {
    "infoResponse": {
      "infoResponse": {
        "codigoEstado": "0",
        "descripcion": "Proceso Terminado Correctamente",
        "error": false,
        "requestId": "",
        "severidad": "INFO"
      },
      "usuarioBasicoLDAPDTO": {
        "loginName": "Test, Batman (Colombia)",
        "uidUsuario": "33d37125-b138-4d8f-a2e3-39899368b4b1",
        "samaccountName": "CC12345500",
        "nombre": "Pruebas",
        "apellido": "QA",
        "email": "jairo.becerra@outsourcing.libertycolombia.com",
        "telefonoFijo": "59685445",
        "tipoDocumento": "CC",
        "numeroDocumento": "12345500",
        "celular": "3214220349",
        "isAdministrador": false,
        "servidorExterno": false,
        "isValidado": true,
        "isUsuarioActivo": true,
        "forzarModPassword": false,
        "passwordExpiro": false,
        "bloqueoLdap": false,
        "proximoVencer": false,
        "distinguishedName": "CN=Test\\, Batman (Colombia),OU=Oleoductos,OU=PREP,DC=libertycolombia,DC=com",
        "isGestor": true,
        "existeAsociacion": true,
        "atributosPersonalizados": [
          {
            "nombreAtributo": "sucursalIntermediario",
            "valoresPersonalizados": [
              "LIBERTY SEGUROS S.A. AGENCIA ARMENIA"
            ]
          },
          {
            "nombreAtributo": "nombreIntermediario",
            "valoresPersonalizados": [
              "prueba test hogar"
            ]
          },
          {
            "nombreAtributo": "likeToGetEmail",
            "valoresPersonalizados": [
              "False"
            ]
          },
          {
            "nombreAtributo": "idIntermediario",
            "valoresPersonalizados": [
              "9006570567"
            ]
          },
          {
            "nombreAtributo": "clavesHijas",
            "valoresPersonalizados": [
              "90833"
            ]
          },
          {
            "nombreAtributo": "clavePrincipal",
            "valoresPersonalizados": [
              "90833"
            ]
          },
          {
            "nombreAtributo": "claveIaxis",
            "valoresPersonalizados": [
              "4090833"
            ]
          }
        ],
        "usuarioInterno": false
      }
    }
  }

}

const OK_DATA_LDAP_USERS = {
  "status": {
      "code": 200,
      "details": "ok"
  },
  "data": {
      "infoResponse": {
          "infoResponse": {
              "codigoEstado": "0",
              "descripcion": "Proceso Terminado Correctamente",
              "error": false,
              "requestId": "",
              "severidad": "INFO"
          },
          "usuarioInterno": false,
          "usuarioLdapCollectionDto": {
              "paginacionResponseDTO": {
                  "totalRegistros": 1,
                  "paginaActual": 1,
                  "registrosPagina": 10,
                  "cantidadPaginas": 1
              },
              "listaUsuarioLdap": [
                  {
                      "loginName": "Test, Batman (Colombia)",
                      "uidUsuario": "33d37125-b138-4d8f-a2e3-39899368b4b1",
                      "samaccountName": "CC12345500",
                      "nombre": "Pruebas",
                      "apellido": "QA",
                      "email": "jairo.becerra@outsourcing.libertycolombia.com",
                      "telefonoFijo": "59685445",
                      "tipoDocumento": "CC",
                      "numeroDocumento": "12345500",
                      "celular": "3214220349",
                      "isAdministrador": false,
                      "servidorExterno": false,
                      "isValidado": true,
                      "isUsuarioActivo": true,
                      "forzarModPassword": false,
                      "passwordExpiro": false,
                      "bloqueoLdap": false,
                      "oleoductoWeb": "OL",
                      "proximoVencer": false,
                      "distinguishedName": "CN=Test\\, Batman (Colombia),OU=Oleoductos,OU=PREP,DC=libertycolombia,DC=com",
                      "isGestor": true,
                      "listaUsuarioApp": [
                          {
                              "atributosPersonalizados": [
                                  {
                                      "nombreAtributo": "sucursalIntermediario",
                                      "valoresPersonalizados": [
                                          "LIBERTY SEGUROS S.A. AGENCIA ARMENIA"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "nombreIntermediario",
                                      "valoresPersonalizados": [
                                          "prueba test hogar"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "likeToGetEmail",
                                      "valoresPersonalizados": [
                                          "False"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "idIntermediario",
                                      "valoresPersonalizados": [
                                          "9006570567"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "clavesHijas",
                                      "valoresPersonalizados": [
                                          "90833"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "clavePrincipal",
                                      "valoresPersonalizados": [
                                          "90833"
                                      ]
                                  },
                                  {
                                      "nombreAtributo": "claveIaxis",
                                      "valoresPersonalizados": [
                                          "4090833"
                                      ]
                                  }
                              ],
                              "gruposAplicacion": [
                                  "Consulta Siniestros",
                                  "Consulta Produccion",
                                  "Consulta Renovaciones"
                              ],
                              "nombreAplicacion": "PortalIntermediarios"
                          }
                      ],
                      "aplicacionPrincipal": false
                  }
              ]
          }
      }
  }
}
module.exports = {
  ERROR_RESPONSE_TEMPLATE,
  OK_RESPONSE_TEMPLATE,
  OK_DATA_LDAP_USER,
  OK_DATA_LDAP_USERS
};
