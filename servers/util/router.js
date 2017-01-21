let express = require('express');

/** @namespace router.get */
/** @namespace router.post */
/** @namespace router.put */
/** @namespace router.delete */

let router = express.Router();

router.v1 = function (path) {
    return '/api/v1/' + path;
};

router.v1Path = function (key) {
    return function (path) {
        if (path) {
            path = '/' + path;
        } else {
            path = '';
        }

        return router.v1(key + path);
    };
};

module.exports = router;