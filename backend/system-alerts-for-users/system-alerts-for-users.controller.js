const express = require('express');
const router = express.Router();
const systemAlertsService = require('./system-alerts-for-users.service');

// routes
router.get('/', getAll);
router.post('/logAlert', logAlert);
router.put('/:id', update);

module.exports = router;


function getAll(req, res, next) {
    systemAlertsService.getAll()
        .then(logTrack => res.json(logTrack))
        .catch(err => next(err));
}

function logAlert(req, res, next) {
    systemAlertsService.logData(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function update(req, res, next) {
    systemAlertsService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
