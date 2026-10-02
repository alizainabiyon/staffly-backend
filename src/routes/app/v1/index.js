const router = require('express').Router();

// common routes
const profile = require('./common/profile.route');
const till = require('./common/till.route');
const reports = require('./common/reports.route');
const employee = require('./payroll/employee.route');
const attendance = require('./payroll/attendance.route');
const salary = require('./payroll/salary.route');
const loan = require('./payroll/loan.route');
const customer = require('./crm/customer.route');
const contractor = require('./crm/contractor.route');
const vendor = require('./crm/vendor.route');
const vendorOrder = require('./crm/vendorOrder.route');
const director = require('./director/director.route');
const dailyEntry = require('./dailyEntry/dailyEntry.route');
const fileHandler = require('./common/fileHandler.route');

// finance routes
const quotation = require('./finance/quotation.route');
const invoice = require('./finance/invoice.route');
const ledger = require('./finance/ledger.route');

const { routesConfig } = require('../../../lib/configs');

const { routes } = routesConfig.app.versions.v1;

// common routes
router.use(routes.profile.path, profile);
router.use(routes.till.path, till);
router.use(routes.reports.path, reports);
router.use(routes.employee.path, employee);
router.use(routes.attendance.path, attendance);
router.use(routes.salary.path, salary);
router.use(routes.loan.path, loan);
router.use(routes.customer.path, customer);
router.use(routes.contractor.path, contractor);
router.use(routes.vendor.path, vendor);
router.use(routes.vendorOrder.path, vendorOrder);
router.use(routes.director.path, director);
router.use(routes.dailyEntry.path, dailyEntry);
router.use(routes.fileHandler.path, fileHandler);

// finance routes
router.use(routes.quotation.path, quotation);
router.use(routes.invoice.path, invoice);
router.use(routes.ledger.path, ledger);

module.exports = router;
