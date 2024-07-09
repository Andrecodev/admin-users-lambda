const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const UsuarioExistLDAPRequestDTO = {
  UsuarioExistLDAPRequestDTO: {
    usuarioExistLDAPFilterDto: {
      descripcion: null,
      loginName: null,
      nombreAplicacion: 'PortalIntermediarios',
      servidorExterno: false,
    },
  },
};

const getUsuarioGestorRedComercialRequestDTO = ({ user, ip = "0.0.0.0" }) => {
  const requestId = ip.split(".").join("");
  const currentDate = dayjs.utc().format("YYYY-MM-DDTHH:mm:ss");
  const dto = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:uwb="http://Suscripcion/UWBPM">
      <soapenv:Header/>
      <soapenv:Body>
        <uwb:consultarRedComercialPorUsuario>
            <consultarRedComercialPorUsuarioRq>
              <infoRequest>
                  <requestID>${requestId}</requestID>
                  <fecha>${currentDate}</fecha>
                  <aplicacionCliente>Portal</aplicacionCliente>
                  <terminal>Development</terminal>
                  <ip>${ip}</ip>
              </infoRequest>
              <usuario>${user}</usuario>
            </consultarRedComercialPorUsuarioRq>
        </uwb:consultarRedComercialPorUsuario>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const commercialDTO = {
      envelope: dto,
    };

  return commercialDTO;
};

const UsuarioLDAPRequestDTO = {
  UsuarioLDAPRequestDTO: {
    usuarioLDAPFilterDto: {
      loginName: null,
      uidUsuario: null,
      nombre: null,
      apellido: null,
      email: null,
      tipoDocumento: null,
      numeroDocumento: null,
      aplicacion: 'PortalIntermediarios',
      isAdministrador: null,
      servidorExterno: false,
      atributosPersonalizados: [],
      isIAXIS: null,
      aplicacionIgual: false,
      distinguishedName: null,
      isGestor: null,
      paginacionFilterDTO: {
        paginaSolicitada: 1,
        paginaSolicitadaSpecified: true,
        registrosPagina: 10,
        registrosPaginaSpecified: true,
      },
    },
  },
};




const UserDto = {
  clave: null,
  claveshijas: [],
  operacion: null,
  tipoid: null,
  numeroid: null,
  email: null,
  usuario: null,
  name: null,
  modulos: null,
  sucursal: null,
  app: null,
  celular: null,
  isAdministrador: false,
  servidorExterno: false,
  isValidado: false,
  isUsuarioActivo: true,
  forzarModPassword: false,
  passwordExpiro: false,
  bloqueoLdap: false,
  oleoductoWeb: null,
  isGestor: false,
};

const usuarioPwdLDAPRequestDTO = {
  UsuarioPwdLDAPRequestDTO: {
    usuarioPwdDTO: {
      forzarModPassword: true,
      loginName: null,
      servidorExterno: false,
      password: null,
    },    
    migracion: false,
  },
};

module.exports = {
  UsuarioExistLDAPRequestDTO,
  UsuarioLDAPRequestDTO,
  UserDto,
  usuarioPwdLDAPRequestDTO,
  getUsuarioGestorRedComercialRequestDTO,
};
