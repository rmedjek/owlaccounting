const db = require('../_helpers/db');
const JournalEntries = db.JournalEntries;


module.exports = {
    getAll,
    createAccount,
    update
};

async function getAll() {
    return await JournalEntries.find({});
}

async function createAccount(userParam) {
    const entry = new JournalEntries(userParam);
    entry.imageData = userParam.imageData;
    entry.imageName = userParam.imageName;
    entry.imageType = userParam.imageType;
    Object.assign(entry, userParam);

    await entry.save();
}

async function update(id, userParam) {
    const account = await JournalEntries.findById(id);
    // validate
    if (!account) throw 'Entry not found';

    // copy userParam properties to user
    Object.assign(account, userParam);

    await account.save();
}
