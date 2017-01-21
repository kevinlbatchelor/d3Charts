let router = require( '../util/router');
let nodeInfo = require('../package.json');

router.get('/status', function (req, res) {
    res.json({
        status: 'online',
        version: nodeInfo.version
    });
});

module.exports = router;