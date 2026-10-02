const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.reports;
const {
  docxToPdfConvert,
  expenseReport,
  getTotalEmployeeVendorCustomer,
  getMonthlySalaryReport,
  getRemainingBalanceReport,
} = require('../../../../controllers/app/common/reports.controller');

router.post(subPaths.docxToPdfConvert, docxToPdfConvert);
router.get(subPaths.expenseReport, expenseReport);
router.get(subPaths.getTotalEmployeeVendorCustomer, getTotalEmployeeVendorCustomer);
router.get(subPaths.getMonthlySalaryReport, getMonthlySalaryReport);
router.get(subPaths.getRemainingBalanceReport, getRemainingBalanceReport);

module.exports = router;