const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.quotation;
const {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  getQuotationsByCustomer,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  searchQuotations,
  getQuotationStats,
  convertToInvoice,
} = require('../../../../controllers/app/finance/quotation.controller');

router.post(subPaths.createQuotation, createQuotation);
router.get(subPaths.getAllQuotations, getAllQuotations);
router.get(subPaths.getQuotationById, getQuotationById);
router.get(subPaths.getQuotationsByCustomer, getQuotationsByCustomer);
router.put(subPaths.updateQuotation, updateQuotation);
router.put(subPaths.updateQuotationStatus, updateQuotationStatus);
router.delete(subPaths.deleteQuotation, deleteQuotation);
router.get(subPaths.searchQuotations, searchQuotations);
router.get(subPaths.getQuotationStats, getQuotationStats);
router.post(subPaths.convertToInvoice, convertToInvoice);

module.exports = router; 