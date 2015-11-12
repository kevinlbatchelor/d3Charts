var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();
var jwtSecret = 'lakfja;ldskjf';

var user = {
    username: 'user',
    password: 'pw'
};

app.use(cors());
app.use(bodyParser.json());

app.get('/random-user', function (req, res) {
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.listen(3000, function () {
    console.log('App listening on localhost 3000')
});

var authenticate = function (req, res, next) {
    var body = req.body;
    if (!body.username || !body.password) {
        res.status(400).end('Must provide username and password')
    }
    if (body.username !== user.username || body.password !== user.password) {
        res.status(401).end(
            'password is bogus'
        )
    }
    next();
};

app.post('/login', authenticate, function (req, res) {
    var token = jwt.sign({username: user.username}, jwtSecret);
    res.send({
        token: token,
        user: user
    })
});

