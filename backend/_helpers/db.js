const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.connectionString)
    .then(() => {
    console.log('Connected to db');
}).catch(() => {
    console.log('Connection failed');
});

module.exports = {
    User: require('../users/user.model'),
    logTrack: require('../logTrack/logTrack.model'),
    chartOfAccounts: require('../chart-of-accounts/chartOfAccounts.model'),
};

