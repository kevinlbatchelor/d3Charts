var Promise = require('bluebird');
var db = require('../util/database/db');

module.exports = {
    up: function (queryInterface) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return Promise.resolve()
            .then(function () {
                return queryInterface.addColumn('battleCard', 'orgId', db.INTEGER);
            })
            ;
    },

    down: function (queryInterface) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.dropTable('users');
         */
    }
};
