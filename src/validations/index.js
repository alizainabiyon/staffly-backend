const { user, profile, employee, customer, fileHandler, attendance, salary, loan, quotation, invoice, contractor, vendor, vendorOrder, director, dailyEntry, ledger, till, reports } = require('../validations/schemas');

exports.validationSchemas = {
  ...user,
  ...profile,
  ...employee,
  ...customer,
  ...fileHandler,
  ...attendance,
  ...salary,
  ...loan,
  ...quotation,
  ...invoice,
  ...contractor,
  ...vendor,
  ...vendorOrder,
  ...director,
  ...dailyEntry,
  ...ledger,
  ...till,
  ...reports,
};
