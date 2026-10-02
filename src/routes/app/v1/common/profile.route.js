const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.profile;
const {
  get,
  updateProfile,
  updateCompany,
} = require('../../../../controllers/app/common/profile.controller');

router.get(subPaths.root, get);
router.put(subPaths.updateProfile, updateProfile);
router.put(subPaths.updateCompany, updateCompany);

module.exports = router;
