const router = require('express').Router();

const user = require('./user.route');

const { routesConfig } = require('../../../lib/configs');

const { routes } = routesConfig.auth.versions.v1;

router.use(routes.user.path, user);

module.exports = router;
