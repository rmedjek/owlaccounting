const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: { type: String, required: true },
    createdBy: { type: String, required: true },
    accountDebit: { type: [String], required: true },
    accountCredit: { type: [String], required: true },
    amountDebit: { type: [Number], required: true},
    amountCredit: { type: [Number], required: true },
    description: { type: String, required: false},
    imageData: { type: String, required: false},
    declineReason: { type: String, required: false},
    createdDate: { type: Date, default: Date.now },
    status: { type: String, default: 'pending'}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('JournalEntries', schema);
