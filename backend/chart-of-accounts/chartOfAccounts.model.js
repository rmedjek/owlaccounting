const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    accountName: { type: String, required: true },
    accountNumber: { type: Number, unique: true, required: true },
    accountDesc: { type: String },
    accountTerm: { type: String, required: false },
    accountType: { type: String, required: true },
    accountSubType: { type: String, required: true },
    debit:  { type: Boolean, required: true },
    credit: { type: Boolean, required: true },
    accountInitBalance: { type: Number, required: true },
    accountBalance: { type: Number, required: true },
    createdBy: { type: String },
    accountActive: { type: Boolean, required: true },
    createdDate: { type: Date, default: Date.now },
    order: { type: Number }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ChartOfAccounts', schema);
