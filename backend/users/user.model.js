const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String,   required: true, unique: true },
    role: { type: String, required: true },
    accountActive: { type: Boolean, required: true },
    passwordExpired: { type: Boolean, required: true},
    passwordCreationDate: {type: Date, default: Date.now},
    createdDate: { type: Date, default: Date.now }
});

schema.plugin(uniqueValidator);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
