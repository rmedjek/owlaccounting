const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const AutoIncrementFactory = require('mongoose-sequence');

const connection = mongoose.connect(config.connectionString)
    .then(() => {
    console.log('Connected to db');
}).catch(() => {
    console.log('Connection failed');
});

const AutoIncrement = AutoIncrementFactory(connection);

module.exports = {
    User: require('../users/user.model'),
    logTrack: require('../log-track/logTrack.model'),
    chartOfAccounts: require('../chart-of-accounts/chartOfAccounts.model'),
    JournalEntries: require('../journal-entries/journalEntries.model'),
    ledger: require('../ledger/ledger.model'),
    systemAlert: require('../system-alerts-for-users/system-alerts-for-users.model')
};

