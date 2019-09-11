const db = require('../_helpers/db');
const LogTrack = db.LogTrack;


module.exports = {
    getAll,
    logData
};

async function getAll() {
    return await LogTrack.find({});
}

async function logData(userParam) {
    const logTrackdata = new LogTrack(userParam);
    logTrackdata.logDataInput = userParam.logDataInput;
    await logTrackdata.save();
}
