//  auth validation schemas
const { user } = require('./auth/user.schema');
const { employee } = require('./app/employee.schema');
const { attendance } = require('./app/attendance.schema');
const { salary } = require('./app/salary.schema');
const { loan } = require('./app/loan.schema');
const { customer } = require('./app/customer.schema');
const { contractor } = require('./app/contractor.schema');
const { vendor } = require('./app/vendor.schema');
const { vendorOrder } = require('./app/vendorOrder.schema');
const { director } = require('./app/director.schema');
const { dailyEntry } = require('./app/dailyEntry.schema');
// finance validation schemas
const { quotation } = require('./app/quotation.schema');
const { invoice } = require('./app/invoice.schema');
const { ledger } = require('./app/ledger.schema');
// commom validation schemas
const { profile } = require('./common/profile.schema');
const { fileHandler } = require('./common/fileHander.schema');
const { till } = require('./common/till.schema');
const { reports } = require('./common/reports.schema');

module.exports = {
  user,
  employee,
  attendance,
  salary,
  loan,
  customer,
  contractor,
  vendor,
  vendorOrder,
  director,
  dailyEntry,
  quotation,
  invoice,
  ledger,
  profile,
  fileHandler,
  till,
  reports,
};
