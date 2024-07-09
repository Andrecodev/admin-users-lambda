const { LDAP_NAME, VERIFY_USER } = require("../constants/soapOrchestrator");
const { UserDto } = require("../models/login/dtos");

const loginData = {
  type: "cc",
  number: "12345500",
  password: "OO6/8iB3TfsR84ORd8qW0A==",
};

const loginDataGestor = {
  type: "cc",
  number: "12345500Gestor",
  password: "OO6/8iB3TfsR84ORd8qW0A==",
};


const changePasswordData = {
  type: "cc",
  number: "12345500",
  password: "OO6/8iB3TfsR84ORd8qW0A==",
  newPassword: "OO6/8iB3TfsR84ORd8qW0A==",
};


const recoveryData = {
  type: "cc",
  number: "12345500",
};


const queryUsersData = {
  name: "Jairo",
  lastName: "Test",
  email: "Jairo.becerra@outsourcing.libertycolombia.com",
  number: "12345500",
  broker: "90833",
  RequestPage: "1",
  itemsForPage: "15",
};
const validUsersData = {
  number: "12345500",
  broker: "90833",
  type: "cc"

};


const changeStatusUserData = {
  status: "TRUE",
  DistinguishedName: "CN=test test\\, Jairo creacion (Colombia),OU=Oleoductos,OU=DEV,DC=libertycolombia,DC=com",

};

const deteleUserData = {
  CommonName: "test test, Jairo creacion (Colombia)",
  DistinguishedName: "CN=test test\\, Jairo creacion (Colombia),OU=Oleoductos,OU=DEV,DC=libertycolombia,DC=com",

};


const createUserData = {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "123456789",
  "Broker": "90833",
  "BrokerChilds": ["90833"],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0",  
  "Features": ["Consulta Cartera", "Consulta Comision-Basicas"]
};

const createUserInValidData = {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "12345678",
  "Broker": "90833",
  "BrokerChilds": [],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0",  
  "Features": []
};
const UpdateUserInValidData = {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "12345500",
  "Broker": "90833",
  "BrokerChilds": [],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0",  
  "Features": [],
  "Verified":"True"
};

const UpdateUserData = {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "12345500",
  "Broker": "90833",
  "BrokerChilds": ["90833"],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0",  
  "Features": ["Consulta Cartera", "Consulta Comision-Basicas"],
  "Verified":"True"
};


const createUserAdminData = {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "12345678",
  "Broker": "90833",
  "BrokerChilds": ["90833"],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0"  
};

const createUserGestorData= {
  "Names": "test creacion",
  "LastNames": "test apellido",
  "TypeDocument": "CC",
  "NumberId": "12345678",
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0"  
};


const createUserIAXISData = {
  "Names": "test creacion",
  "LastNames": "test apellidoIAXIS",
  "TypeDocument": "CC",
  "NumberId": "1234567890033",
  "Broker": "90833",
  "BrokerChilds": ["90833"],
  "Mail": "jairo.becerra@outsourcing.libertycolombia.com",
  "Telephone": "6252525",
  "Cellphone": "0",  
  "Features": ["Consulta Cartera", "Consulta Comision-Basicas", "cotizador"]
};


const mainLoginEvent = {
  path: "api/gateway/login",
  body: {
    data: loginData
  },
  sourceIP: "1.2.3.4",
};

const gestorLoginEvent = {
  path: "api/gateway/validate",
  body: {
    data: {
      brokerKey: 123,
      user: UserDto,
    },
  },
  sourceIP: "1.2.3.4",
};

const queryUsersEvent = {
  path: "api/gateway/queryUsers",
  body: {
    data: {
      name: "dssdfsd",
      lastName: "dsfsd",
      email: "",
      number: "",
      broker: 90833,
      RequestPage: 1,
      itemsForPage: 10,
    },
  },
  sourceIP: "sourceIP",
};

const keysEvent = {
  user: "User Name (Test)",
};

const recoveryPasswordEvent = {
  path: "api/gateway/recover",
  body: {
    data: loginData
  },
};

const createUserGestorEvent = {
  path: "api/gateway/createUserGestor",
  body: {
    data: createUserGestorData
  },
};

const soapEvent = {
  body: {
    data: loginData,
  },
  soapName: LDAP_NAME,
  methodName: VERIFY_USER,
};

const commercialNetworkEvent = {
  user: `${loginData.type}${loginData.number}`,
};

const KeyEvent = {
  Broker: "1044",
};


module.exports = {
  loginData,
  mainLoginEvent,
  gestorLoginEvent,
  keysEvent,
  recoveryPasswordEvent,
  soapEvent,
  commercialNetworkEvent,
  queryUsersData,
  queryUsersEvent,
  changeStatusUserData,
  deteleUserData,
  createUserData,
  recoveryData,
  createUserIAXISData,
  changePasswordData,
  createUserAdminData,
  createUserGestorData,
  createUserGestorEvent,
  UpdateUserData,
  validUsersData,
  UpdateUserInValidData,
  createUserInValidData,
  loginDataGestor,
  KeyEvent
};
