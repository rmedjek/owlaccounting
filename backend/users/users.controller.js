const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const db = require('../_helpers/db');
const jwt = require('jsonwebtoken');
const User = db.User;
const config = require('../config.json');
const sendEmail = require( '../_helpers/mail');
const passport = require('passport');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/current', getCurrent);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/forgotpassword', forgotPassword);
router.put('/reset-password', passport.authenticate('jwt', { session: false }, resetPassword));


module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({success: true, message: "User created successfully"}))
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
        .then(() => res.json({success: true, message: "User updated successfully"}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

async function forgotPassword(req, res, value) {
    try {
     //   const { value, error } = userService.validateForgotSchema(req.body);
     //    if (error && error.details) {
     //        return res.sendStatus(400).json(error);
     //    }
        const criteria = {
            $or: [
                { 'google.email':  value.email },
                { 'github.email':  value.email },
                { 'twitter.email': value.email },
                { 'local.email':   value.email },
            ],
        };
        const user = await User.findOne(criteria);
        console.log('User: ' + user.email);
        if (!user) {
            const error = 'could not find user';
            res.status(404).json( { error });
            return ;
        }
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1h' });
        console.log('token ' + token);
        const resetLink = `<h4> Please click on the link to reset the password </h4>
                            <a href ='${config.apiUrl}/reset-password/${token}'>Reset Password</a>`;
        console.log('reset link' + resetLink);
        const sanitizedUser = userService.getById(user.id);
        console.log('sanitized ' + JSON.stringify(sanitizedUser));
        const results = await sendEmail({
            html: resetLink,
            subject: 'Forgot Password',
            email: sanitizedUser.email,
        });
        console.log('results '+ JSON.stringify(results));
        return res.json(results);
    } catch (err) {
        console.log(err);
        return res.status(500)
    }
}

async function resetPassword(req, res) {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ err: 'password is required' });
        }
        const user = await User.findById(req.currentUser._id);
        const sanitizedUser = userService.getById(user.id);
        if (!user.email) {
            user.email = sanitizedUser.email;
            user.name = sanitizedUser.name;
        }
        await userService.getEncryptedPassword(password);
        await user.save();
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}
