const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    email: String,
    role: { type: String, required: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.plugin(uniqueValidator);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema, 'user_list');
