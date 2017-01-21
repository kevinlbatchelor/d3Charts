let router = require('../util/router');
let BattleCard = require('./battleCard');
let Competitor = require('./competitor');
let DB = require('../util/database/db');
let _ = require('lodash');

let route = router.v1Path('card');

router.get(route(), (request, response)=> {
    let org = request.jwtPayload.orgid;
    BattleCard.findAll({
        where: {orgId: org},
        include: [{model: Competitor}],
        order: [['name', 'ASC']]
    }).then((list)=> {
        response.json(list);
    }).catch((err)=> {
        response.status(500).send(err);
    });
});

router.get(route(':id'), (request, response) => {
    let org = request.jwtPayload.orgid;
    let id = request.params.id;
    BattleCard.findById(id, {
        where: {orgId: org},
        include: [{model: Competitor}]
    }).then((card)=> {
        if (card.competitors === null) {
            card.competitors = [];
        }
        response.json(card);
    }).catch((err) => {
        response.status(500).send(err);
    });
});

router.get(route('team/:teamId'), (request, response) => {
    let org = request.jwtPayload.orgid;
    let teamId = request.params.teamId;
    BattleCard.findAll({
        where: {
          teams: {
            $contains: teamId
          }
        },
        include: [{model: Competitor}]
      }).then((list)=> {
          response.json(list);
      }).catch((err)=> {
          response.status(500).send(err);
      });
});


router.post(route(), (request, response) => {
    let org = request.jwtPayload.orgid;
    let competitors = [];
    let newBattleCard = request.body;
    newBattleCard.orgId = org;
    if (newBattleCard.competitors.length < 1 || _.isUndefined(newBattleCard.competitors)) {
        newBattleCard.competitors = competitors;
    }

    newBattleCard.competitors = newBattleCard.competitors.map((oneCompetitor)=> {
        if (!oneCompetitor.overview) {
            oneCompetitor.overview = {};
            oneCompetitor.overview.win = [];
            oneCompetitor.overview.lose = [];
            oneCompetitor.overview.fight = [];
        }
        return oneCompetitor;
    });


    DB.connection.transaction().then((t)=> {
        BattleCard.create(newBattleCard, {include: [Competitor], transaction: t})
            .then((card)=> {
                response.json(card);
                t.commit();
            }, (err)=> {
                response.status(500).send(err);
                t.rollback();
            })
        ;
    });
});

router.put(route(':id'), (request, response)=> {
    let newBattleCard = request.body;
    newBattleCard.orgId = request.jwtPayload.orgid;
    let id = request.params.id;
    let options = {
        where: {id: id},
        include: [{model: Competitor}]
    };

    let buildCompetitors = newBattleCard.competitors.map((comp)=> {
        delete comp['id'];
        comp.battleCardId = id;
        return comp;
    });

    BattleCard.findOne(options).then((card)=> {
        DB.connection.transaction(function (t) {
            return card.update(newBattleCard, {transaction: t}).then(()=> {
                return Competitor.destroy({where: {battleCardId: id}, transaction: t}).then(()=> {
                    return Competitor.bulkCreate(buildCompetitors, {transaction: t}).then(()=> {
                        return card;
                    }, ()=> {
                        t.rollback();
                    }, ()=> {
                        t.rollback();
                    });
                });
            });
        }).then((data)=> {
            response.json(data);
        }).catch((err)=> {
            response.status(500).send(err);
        });
    });
});

router.delete(route(':id'), (request, response)=> {
    let org = request.jwtPayload.orgid;
    let id = request.params.id;
    DB.connection.transaction(function (t) {
        return BattleCard.destroy({where: {id: id, orgId: org}}).then(() => {
            return Competitor.destroy({where: {battleCardId: id}, transaction: t});
        }).then((success)=> {
            response.json(success);
        }).catch((error)=> {
            response.status(500).send(error);
        });
    });
});

module.exports = router;
