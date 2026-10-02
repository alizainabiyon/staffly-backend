const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.invoice;
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomer,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  searchInvoices,
  getInvoiceStats,
  createLedgerEntry,
  sendInvoice,
} = require('../../../../controllers/app/finance/invoice.controller');

router.post(subPaths.createInvoice, createInvoice);
router.get(subPaths.getAllInvoices, getAllInvoices);
router.get(subPaths.getInvoiceById, getInvoiceById);
router.get(subPaths.getInvoicesByCustomer, getInvoicesByCustomer);
router.put(subPaths.updateInvoice, updateInvoice);
router.put(subPaths.updateInvoiceStatus, updateInvoiceStatus);
router.delete(subPaths.deleteInvoice, deleteInvoice);
router.get(subPaths.searchInvoices, searchInvoices);
router.get(subPaths.getInvoiceStats, getInvoiceStats);
router.post(subPaths.createLedgerEntry, createLedgerEntry);
router.post(subPaths.sendInvoice, sendInvoice);

module.exports = router; 