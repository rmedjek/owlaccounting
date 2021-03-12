const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log('Connected to db');
}).catch(() => {
    console.log('Connection failed');
});

module.exports = {
    User: require('../users/user.model'),
};

