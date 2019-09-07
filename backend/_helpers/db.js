const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString);
mongoose.Promise = global.Promise;

// TODO: add modules
module.exports = {
    User: require('../users/user.model'),
};

