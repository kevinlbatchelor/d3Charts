let fs = require('fs');
let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let dbSetup = require('./util/database/dbSetup');
let config = require('./config/config');
let router = require('./util/router');

const cors = require('cors');
let jwt = require('express-jwt');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
app.use(cors());

app.use(jwt({secret: config.idmPublicKey, requestProperty: 'jwtPayload'}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Authorization');
    }
});

app.all(router.v1('*'));

app.use('/', require('./util/status'));
app.use('/', require('./object/battleCardRoutes'));

// TODO add other routes

app.use((err, req, res, next) => {
    err.status = 404;
    next(err);
});

// Error handler is identified by four-piece signature (http://expressjs.com/en/guide/error-handling.htmlError)
app.use((err, req, res) => {
    let message = 'Error: ' + (err.message || 'An unknown error occurred');

    req.log.error({stack: err.stack}, message);

    let response = {message};
    // Only show full error for local dev
    if (app.get('env') === 'development') {
        response.stack = err.stack;
    }
    res.status(err.status || 500).json(response);
});

// Start the server

app.set('port', config.server.port);

dbSetup();

require('http').createServer(app).listen(app.get('port'));

