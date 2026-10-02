const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.customer;
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomersByContractor,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
  getCustomerStats,
} = require('../../../../controllers/app/crm/customer.controller');

router.post(subPaths.createCustomer, createCustomer);
router.put(subPaths.updateCustomer, updateCustomer);
router.get(subPaths.getAllCustomers, getAllCustomers);
router.delete(subPaths.deleteCustomer, deleteCustomer);
router.get(subPaths.getCustomerById, getCustomerById);
router.get(subPaths.getCustomersByContractor, getCustomersByContractor);
router.put(subPaths.updateCustomerStatus, updateCustomerStatus);
router.get(subPaths.searchCustomers, searchCustomers);
router.get(subPaths.getCustomerStats, getCustomerStats);

module.exports = router; 