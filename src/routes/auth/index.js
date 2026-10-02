const router = require('express').Router();

const v1 = require('./v1');
const { routesConfig } = require('../../lib/configs');
const { versions } = routesConfig.auth;

router.use(versions.v1.path, v1);

module.exports = router;
