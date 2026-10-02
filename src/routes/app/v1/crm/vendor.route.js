const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.vendor;
const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require('../../../../controllers/app/crm/vendor.controller');

router.post(subPaths.createVendor, createVendor);
router.get(subPaths.getAllVendors, getAllVendors);
router.get(subPaths.getVendorById, getVendorById);
router.put(subPaths.updateVendor, updateVendor);
router.delete(subPaths.deleteVendor, deleteVendor);

module.exports = router; 