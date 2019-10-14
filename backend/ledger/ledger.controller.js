const express = require('express');
const router = express.Router();
const ledgerService = require('./ledger.service');

// routes
router.get('/', getAll);
router.post('/newEntry', newLedgerEntry);

module.exports = router;


function getAll(req, res, next) {
    ledgerService.getAll()
        .then(logTrack => res.json(logTrack))
        .catch(err => next(err));
}

function newLedgerEntry(req, res, next) {
    ledgerService.newLedgerEntry(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
