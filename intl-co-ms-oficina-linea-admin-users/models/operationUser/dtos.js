
const usuarioEstadoLDAPRequestDTO = {
  UsuarioEstadoLDAPRequestDTO: {
    usuarioEstadoLDAPDTO: {
      deshabilitar: null,
      loginName: null,
      servidorExterno: false
    }
  }
};

const usuarioDelLDAPRequestDTO = {
  UsuarioDelLDAPRequestDTO: {
    migracion: false,
    usuarioDelLDAPDTO: {
      nombreAplicacion: "PortalIntermediarios",
      loginName: null,
      servidorExterno: false
    }
  }
};

const baseUsuarioLDAPRequestDTO = {
  BaseUsuarioLDAPRequestDTO: {
    migracion: false,
    //parametros obligatorio para que tome la propiedad isGestor 
    primeraVez:false,
    "usuarioLDAPDTO": {
      "NombreAplicacion": "PortalIntermediarios",
      "listaUsuarioApp": [
        {
          "atributosPersonalizados": [
            {
              "nombreAtributo": "clavePrincipal",
              "valoresPersonalizados": [""]
            },
            {
              "nombreAtributo": "likeToGetEmail",
              "valoresPersonalizados": [""]
            },
            {
              "nombreAtributo": "idIntermediario",
              "valoresPersonalizados": [""]
            },
            {
              "nombreAtributo": "nombreIntermediario",
              "valoresPersonalizados": [""]
            },
            {
              "nombreAtributo": "sucursalIntermediario",
              "valoresPersonalizados": [""]
            },
            { "nombreAtributo": "perfilIaxis", "valoresPersonalizados": null },
            { "nombreAtributo": "claveIaxis", "valoresPersonalizados": null },
            {
              "nombreAtributo": "clavesHijas",
              "valoresPersonalizados": [""]
            }
          ],
          "gruposAplicacion": [
          ],
          "nombreAplicacion": "PortalIntermediarios"
        }
      ],
      "aplicacionPrincipal": false,
      "loginName": "",
      "uidUsuario": "",
      "samaccountName": "",
      "nombre": "",
      "apellido": "",
      "email": "",
      "emailOpcional": null,
      "telefonoFijo": "",
      "tipoDocumento": "",
      "numeroDocumento": "",
      "celular": "0",
      "fechaNacimiento": "",
      "isAdministrador": false,
      "isIAXIS": "0",
      "servidorExterno": false,
      "isValidado": false,
      "isUsuarioActivo": true,
      "forzarModPassword": false,
      "passwordExpiro": false,
      "bloqueoLdap": false,
      "oleoductoWeb": null,
      "descripcion": "",
      "proximoVencer": false,
      "distinguishedName": null,
      "isGestor": false
    }
  }
};

const usuarioIaxisRequestDTO = {

  cedula: null,
  nombre: null,
  usuariored: null,
  clavered: null,
  oficina: null,
  telefono: null,
  mail: null,
  sucursal: null,
  ciudad: null,
  departamento: null,
  cargo: "Analista Oleoducto",
  dirreccion: null,
  company: "Liberty Seguros S.A.",
  codigoagente: null,
  perfil: "TD_COTWEB"

}

module.exports = {
  usuarioEstadoLDAPRequestDTO,
  usuarioDelLDAPRequestDTO,
  baseUsuarioLDAPRequestDTO,
  usuarioIaxisRequestDTO

};
