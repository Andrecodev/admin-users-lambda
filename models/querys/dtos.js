const QueryUsers = {
    UsuarioLDAPRequestDTO: {
        usuarioLDAPFilterDto: {
            nombre: '',
            apellido: '',
            email: '',
            numeroDocumento: '',
            loginName: '',
            atributosPersonalizados: [
                //{ nombreAtributo: clavePrincipal, valoresPersonalizados: [90833] },
            ],
            paginacionFilterDTO: {
                paginaSolicitada: 1,
                paginaSolicitadaSpecified: true,
                registrosPagina: 10,
                registrosPaginaSpecified: true,
            },
            aplicacion: "PortalIntermediarios",
            uidUsuario: null,
            tipoDocumento: null,
            //isAdministrador: false,
            servidorExterno: false,
            isIAXIS: null,
            aplicacionIgual: false,
            distinguishedName: null,
            //isGestor: false,
        },
        claveIntermediario: null,
        descripcion: null,
        migracion: false,
    },
};

const QueryUser = {
    UsuarioLDAPRequestDTO: {
        usuarioLDAPFilterDto: {
            loginName: '',
            distinguishedName: '',
            paginacionFilterDTO: {
                paginaSolicitada: 1,
                paginaSolicitadaSpecified: true,
                registrosPagina: 10,
                registrosPaginaSpecified: true,
            },
            aplicacion: "PortalIntermediarios",
            isAdministrador: false,
            isGestor: false,
        },
        migracion: false,
    },
};

module.exports = {
    QueryUsers,
    QueryUser
};
