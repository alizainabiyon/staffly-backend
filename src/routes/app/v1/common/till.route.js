const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.till;
const {
  initializeTill,
  getTill,
  updateTill,
  deleteTill,
} = require('../../../../controllers/app/common/till.controller');

router.post(subPaths.initializeTill, initializeTill);
router.get(subPaths.getTill, getTill);
router.put(subPaths.updateTill, updateTill);
router.delete(subPaths.deleteTill, deleteTill);

module.exports = router;
