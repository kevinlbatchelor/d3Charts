let Promise = require('bluebird');
let DB = require('../util/database/db');

let competitorSchema = {
    name: {type: DB.STRING, allowNull: false},
    overview: {type: DB.JSONB, defaultValue: {win: [], lose: [], fight: []}}
};

let Competitor = DB.connection.define('competitor', competitorSchema, {
    paranoid: true,
    freezeTableName: true
});

Competitor.dbSetup = function () {
    return Promise.resolve();
};

module.exports = Competitor;