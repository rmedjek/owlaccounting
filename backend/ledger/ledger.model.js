const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schema = new Schema({
    journalId: { type: String, unique: false, required: true },
    accountDebit: { type: Boolean, unique: false, required: true },
    accountName: { type: String, unique: false, required: true },
    entryType: { type: String, required: true },
    amount: { type: Number, required: true},
    description: { type: String, required: false},
    createdDate: { type: Date, required: true},
    accountType:  { type: String, required: false},
    prId:  { type: Number, required: false},
});

schema.set('toJSON', { virtuals: true });
schema.plugin(AutoIncrement, {inc_field: 'prId'});

module.exports = mongoose.model('Ledger', schema);
