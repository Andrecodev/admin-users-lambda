const { saveLogDynamo } = require("../controllers/callDatabases");

const customLevelsLog = {
    levels: {
        trace: "trace",
        debug : "debug",
        info : "info",
        warn : "warn",
        error:"error",
        fatal: "fatal"
    }
};



const saveLog = async ( {level, message, data }) => {
    let log = {
        "timestamp": new Date().toJSON(),
        "level": level,
        "message": message,
        "data": {data},
    }
    console.log("log a guardar",log)
    const response = await saveLogDynamo({ log });
    return response;
}

module.exports = { saveLog, customLevelsLog };