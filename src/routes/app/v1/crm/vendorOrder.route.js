const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.vendorOrder;
const {
  createVendorOrder,
  getAllVendorOrders,
  getVendorOrderById,
  getVendorOrdersByVendor,
  updateVendorOrder,
  deleteVendorOrder,
  approveVendorOrder,
  getVendorOrderStats,
} = require('../../../../controllers/app/crm/vendorOrder.controller');

router.post(subPaths.createVendorOrder, createVendorOrder);
router.get(subPaths.getAllVendorOrders, getAllVendorOrders);
router.get(subPaths.getVendorOrderById, getVendorOrderById);
router.get(subPaths.getVendorOrdersByVendor, getVendorOrdersByVendor);
router.put(subPaths.updateVendorOrder, updateVendorOrder);
router.put(subPaths.approveVendorOrder, approveVendorOrder);
router.delete(subPaths.deleteVendorOrder, deleteVendorOrder);
router.get(subPaths.getVendorOrderStats, getVendorOrderStats);

module.exports = router;
