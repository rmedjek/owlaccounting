const db = require('../_helpers/db');
const Ledger = db.ledger;


module.exports = {
    getAll,
    newLedgerEntry
};

async function getAll() {
    return await Ledger.find({});
}

async function newLedgerEntry(userParam) {
    const ledgerEntry = new Ledger(userParam);
    await ledgerEntry.save();
}
