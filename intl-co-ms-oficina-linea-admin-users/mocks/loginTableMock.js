const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const date = dayjs.utc().format("DD/MM/YYYY HH:mm:ss:SSS");
const lastDate = date;

const LOGIN_SESSION_MOCK = {
  Item: {
    userId: "cc12345500",
    brokerId: 123,
    date,
    ipAddress: "1.2.3.4" ,
    lastDate
  },
};

module.exports = {
  LOGIN_SESSION_MOCK,
};
