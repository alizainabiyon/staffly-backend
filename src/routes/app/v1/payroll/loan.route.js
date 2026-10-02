const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.loan;
const {
  createLoan,
  getAllLoans,
  getLoanById,
  getEmployeeLoans,
  updateLoanStatus,
  payInstallment,
  updateLoan,
  deleteLoan,
} = require('../../../../controllers/app/payroll/loan.controller');

router.post(subPaths.createLoan, createLoan);
router.get(subPaths.getAllLoans, getAllLoans);
router.get(subPaths.getLoanById, getLoanById);
router.get(subPaths.getEmployeeLoans, getEmployeeLoans);
router.put(subPaths.updateLoanStatus, updateLoanStatus);
router.put(subPaths.payInstallment, payInstallment);
router.put(subPaths.updateLoan, updateLoan);
router.delete(subPaths.deleteLoan, deleteLoan);

module.exports = router; 