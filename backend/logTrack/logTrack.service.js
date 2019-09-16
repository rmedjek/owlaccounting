const db = require('../_helpers/db');
const logTrack = db.logTrack;


module.exports = {
    getAll,
    logData
};

async function getAll() {
    return await logTrack.find({});
}

async function logData(userParam) {
    const logTrackdata = new logTrack(userParam);
    logTrackdata.logDataInput = userParam.logDataInput;
    await logTrackdata.save();
}
