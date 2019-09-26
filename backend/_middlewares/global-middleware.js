const express = require('express');
const passport = require('passport');

module.exports = setGlobalMiddleware;

function setGlobalMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(logger('dev'));
    app.use(
        session({
            secret: devConfig.secret,
            resave: true,
            saveUninitialized: true
        })
    );
    app.use(passport.initialize({ userProperty: 'currentUser' }));
}
