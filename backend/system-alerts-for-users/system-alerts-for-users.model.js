const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    alertDetail: { type: String, unique: false, required: true },
    accountNumber: { type: Number, unique: false, required: false },
    createdBy: { type: String, unique: false, required: true },
    dateTimeOfEvent: { type: Date, unique: false, default: Date.now },
    performed: { type: Boolean, default: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SystemAlertsForUsers', schema);
