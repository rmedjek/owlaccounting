require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./_helpers/error-handler');
const jwt = require('./_helpers/jwt');


app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, " +
        "X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({  extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT users to secure the api
app.use(jwt());

// API Routes
app.use('/users', require('./users/user.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
