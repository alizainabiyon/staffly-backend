const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.contractor;
const {
  createContractor,
  getAllContractors,
  getContractorById,
  updateContractor,
  deleteContractor,
  searchContractors,
  getContractorStats,
} = require('../../../../controllers/app/crm/contractor.controller');

router.post(subPaths.createContractor, createContractor);
router.get(subPaths.getAllContractors, getAllContractors);
router.get(subPaths.getContractorById, getContractorById);
router.put(subPaths.updateContractor, updateContractor);
router.delete(subPaths.deleteContractor, deleteContractor);
router.get(subPaths.searchContractors, searchContractors);
router.get(subPaths.getContractorStats, getContractorStats);

module.exports = router; 