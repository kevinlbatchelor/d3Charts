let Promise = require('bluebird');
let Umzug = require('umzug');

let db = require('./db');
let dbMigrationTracker = require('./dbMigrationTracker');

const setup = function () {
    let setupCache = {};
    let details;
    let promise = db.connection.sync().then(function (deets) {
        details = deets;
    }).then(function() {
        return dbMigrationTracker.dbSetupPre();
    }).then(function () {
        let umzug = new Umzug({
            storage: 'sequelize',
            storageOptions: {
                sequelize: db.connection
            },
            migrations: {
                params: [db.connection.getQueryInterface()],
                path: process.cwd() + '/dbMigrations'
            }
        });
        return umzug.up().then(function (migrations) {
            console.log('Migrations: ' + migrations.length);
        }, function (err) {
            console.log('err', err);
        }).then(function(){
            return Promise.reduce(details.modelManager.models, function (acc, model) {
                console.log(model.name + ' setup...');
                if (model.dbSetup) {
                    return model.dbSetup(setupCache);
                }
            }, Promise.resolve());
        });
    });

    promise.then(function() {
        db.setupPromise.resolve();
    });

    return promise;
};

module.exports = setup;
