const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.ledger;
const {
  createLedgerEntry,
  getAllLedgerEntries,
  getLedgerEntryById,
  updateLedgerEntry,
  deleteLedgerEntry,
  addTransaction,
  addInvoiceTransaction,
  addVendorOrderTransaction,
} = require('../../../../controllers/app/finance/ledger.controller');

router.post(subPaths.createLedger, createLedgerEntry);
router.get(subPaths.getAllLedger, getAllLedgerEntries);
router.get(subPaths.getLedgerById, getLedgerEntryById);
router.put(subPaths.updateLedger, updateLedgerEntry);
router.delete(subPaths.deleteLedger, deleteLedgerEntry);
router.post(subPaths.addTransaction, addTransaction);
router.post(subPaths.addInvoiceTransaction, addInvoiceTransaction);
router.post(subPaths.addVendorOrderTransaction, addVendorOrderTransaction);

module.exports = router; 