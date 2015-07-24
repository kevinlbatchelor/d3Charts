var express = require('express');
var mongoose = require('mongoose-multitenant')();

mongoose.connect('mongodb://localhost/multitenant', { server: { poolSize: 5 } });

var app = express();

app.use(express.bodyParser());

app.post('/postsm', function (req, res) {
    Author(req.query.tenant).findOne().exec().then(function (author) {
        req.body.author = author.id;
        Post(req.query.tenant).create(req.body).then(function (post) {
            res.json(post);
        }, function (err) {
            console.log('Post error');
            res.send(500, err);
        });
    });
});

app.get('/posts', function (req, res) {
    Post(req.query.tenant).count().exec().then(function (count) {
        res.send({ count: count });
    });
});

app.listen(3000);

console.log('Listening...');

var authorSchema = mongoose.Schema({
    name: String
});

mongoose.mtModel('Author', authorSchema);

Author = function (prefix) {
    return mongoose.mtModel(prefix + '.Author');
};

var postSchema = mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', $tenant: true },
});

mongoose.mtModel('Post', postSchema);

Post = function (prefix) {
    return mongoose.mtModel(prefix + '.Post');
};

// insert tenants
for (var i = 0; i < 40; i++) {
    Author('t' + i).create({ name: 'Author ' + i });
}