const express = require('express');
const router = express.Router();
const userService = require('./chartOfAccounts.service');

// routes
router.post('/createAccount', createAccount);
router.get('/', getAll);
router.put('/:id', update);

module.exports = router;

function createAccount(req, res, next) {
    userService.createAccount(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
