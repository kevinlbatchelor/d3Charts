let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));

let db = require('./db');

let dbMigrationTrackerSchema = {
    name: {
        type: db.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    }
};

let dbMigrationTracker = db.connection.define('SequelizeMeta', dbMigrationTrackerSchema, {
    freezeTableName: true,
    timestamps: false
});

dbMigrationTracker.dbSetupPre = function () {
    return Promise.resolve().then(function () {
        return dbMigrationTracker.count();
    }).then(function (count) {
        if (count === 0) {
            return fs.readdirAsync(process.cwd() + '/dbMigrations');
        }
    }).then(function (migrationList) {
        if (migrationList) {
            return Promise.reduce(migrationList, function (acc, fileName) {
                return dbMigrationTracker.create({
                    name: fileName
                });
            }, Promise.resolve());
        }
    });
};

module.exports = dbMigrationTracker;
