const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const db = require('../_helpers/db');
const User = db.User;
const config = require('../config.json');
const sendEmail = require( '../_helpers/mail');


// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/current', getCurrent);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/forgotpassword', forgotPassword);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

async function forgotPassword(req, res, userParam) {
    try {
     //   const { value, error } = userService.validateForgotSchema(req.body);
     //    if (error && error.details) {
     //        return res.sendStatus(400).json(error);
     //    }
        const user = await User.findOne({ email: userParam.email });
        console.log('User: ' + user);
        if (!user) {
            return res.sendStatus(404).json({ err: 'could not find user' });
        }
        const token = userService.getJWTToken({ id: user._id });
        console.log(token);
        const resetLink = `
       <h4> Please click on the link to reset the password </h4>
       <a href ='${config.apiUrl}/reset-password/${token}'>Reset Password</a>`;

        const sanitizedUser = userService.getById(user.id);
        const results = await sendEmail({
            html: resetLink,
            subject: 'Forgot Password',
            to: sanitizedUser.email,
        });
        return res.json(results);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}
