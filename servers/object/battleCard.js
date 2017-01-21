let Promise = require('bluebird');
let db = require('../util/database/db');
let Competitor = require('./competitor');

let battleCardSchema = {
    name: {type: db.STRING, allowNull: false},
    teams: {type: db.JSONB, defaultValue: []},
    orgId: {type: db.INTEGER}
};


let BattleCard = db.connection.define('battleCard', battleCardSchema, {
    paranoid: true,
    freezeTableName: true
});

BattleCard.hasMany(Competitor);

BattleCard.dbSetup = function (setupCache) {
    return Promise.resolve().then(function () {
        return BattleCard.findAll();
    }).then(function (user) {
        setupCache.rootUser = user;
    });
};

module.exports = BattleCard;