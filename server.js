require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./backend/_helpers/error-handler');
const passport = require('passport');
const jwt = require('./backend/_helpers/jwt');
// const setGlobalMiddleware = require('./backend/_middlewares/global-middleware');

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, " +
        "X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// register global middleware
// setGlobalMiddleware(app);

// use JWT auth to secure the api
//app.use(jwt());

// API Routes
app.use('/users', require('./backend/users/users.controller'));
app.use('/logTrack', require('./backend/logTrack/logTrack.controller'));


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
