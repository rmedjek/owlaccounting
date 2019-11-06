const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    imageName: { type: String, required: false},
    imageType: { type: String, required: false},
    image: { data: Buffer, contentType: String},
    status: { type: String, default: 'pending'},
    journalId:  { type: Number, required: false},

});

schema.set('toJSON', { virtuals: true });
schema.plugin(AutoIncrement, {inc_field: 'journalId'});

module.exports = mongoose.model('JournalEntries', schema);
