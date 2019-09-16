const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    logDataInput: { type: String, unique: false, required: true },
    logInitial: { type: String, unique: false, required: false },
    logFinal: { type: String, unique: false, required: false },
    createdBy: { type: String, unique: false, required: true },
    dateTimeOfEvent: { type: Date, unique: false, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('logTrack', schema);
