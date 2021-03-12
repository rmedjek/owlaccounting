const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/registerAdmin', registerAdmin);
router.post('/register', register);
router.post('/login', login);
// router.get('/loggedUser', loggedUser);

module.exports = router;

function registerAdmin(req, res, next) {
    userService.registerAdmin(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function login(req, res, next) {
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// function getCurrent(req, res, next) {
//     userService.getById(req.params.sub)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

