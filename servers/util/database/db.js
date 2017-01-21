let Promise = require('bluebird');
let DB = require('sequelize');
let config = require('../../config/config');

let connection = new DB(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

DB.connection = connection;

let resolveFunction = null;
DB.setupPromise = new Promise(function (resolve) {
    resolveFunction = resolve;
});
DB.setupPromise.resolve = resolveFunction;

module.exports = DB;
