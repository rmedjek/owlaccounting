const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    journalId: { type: String, unique: false, required: true },
    accountDebit: { type: Boolean, unique: false, required: true },
    accountName: { type: String, unique: false, required: true },
    entryType: { type: String, required: true },
    amount: { type: Number, required: true},
    description: { type: String, required: false},
    createdDate: { type: Date, required: true},
    accountType:  { type: String, required: false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Ledger', schema);
