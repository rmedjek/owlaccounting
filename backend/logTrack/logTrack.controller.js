const express = require('express');
const router = express.Router();
const logTrackService = require('./logTrack.service');

// routes
router.get('/', getAll);
router.post('/logData', logData);

module.exports = router;


function getAll(req, res, next) {
    logTrackService.getAll()
        .then(logTrack => res.json(logTrack))
        .catch(err => next(err));
}

function logData(req, res, next) {
    logTrackService.logData(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
