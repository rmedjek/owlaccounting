const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    accountName: { type: String, required: true },
    accountNumber: { type: Number, unique: true, required: true },
    accountDesc: { type: String },
    normalSide: { type: String, required: true },
    accountTerm: { type: String, required: false },
    accountType: { type: String, required: true },
    accountSubType: { type: String, required: true },
    accountInitBalance: { type: Number, required: true },
    accountBalance: { type: Number, required: true },
    debit:  { type: Number, required: true },
    credit: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: String },
    accountActive: { type: Boolean, required: true },
    accountOrder: { type: Number, unique: true },
    statement: { type: String, required: false},
    comment: { type: String, required: false}
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('ChartOfAccounts', schema);
