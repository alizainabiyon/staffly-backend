const router = require('express').Router();
const { routesConfig } = require('../../../lib/configs');

const { subPaths } = routesConfig.auth.versions.v1.routes.user;
const { signUp, signIn } = require('../../../controllers/auth/user.controller');

router.post(subPaths.signUp, signUp);
router.post(subPaths.signIn, signIn);

module.exports = router;
