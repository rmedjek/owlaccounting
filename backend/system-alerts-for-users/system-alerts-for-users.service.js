const db = require('../_helpers/db');
const systemAlert = db.systemAlert;


module.exports = {
    getAll,
    logData,
    update
};

async function getAll() {
    return await systemAlert.find({});
}

async function logData(userParam) {
    const newSystemAlert = new systemAlert(userParam);
    newSystemAlert.alertDetail = userParam.alertDetail;
    newSystemAlert.accountNumber = userParam.accountNumber;
    await newSystemAlert.save();
}

async function update(id, userParam) {
    const Alert = await systemAlert.findById(id);
    // validate
    if (!Alert) throw 'Entry not found';

    // copy userParam properties to user
    Object.assign(Alert, userParam);

    await Alert.save();
}
