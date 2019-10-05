const express = require('express');
const router = express.Router();
const journalEntryService = require('./journalEntries.service');

// routes
router.post('/createEntry', createEntry);
router.get('/', getAll);
router.put('/:id', update);

module.exports = router;

function createEntry(req, res, next) {
    journalEntryService.createAccount(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    journalEntryService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    journalEntryService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
