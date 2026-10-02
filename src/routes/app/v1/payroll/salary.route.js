const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.salary;
const {
  generateSalaryOfAllEmployees,
  getSalaryHistoryOfAllEmployees,
  getSalaryHistoryOfAnEmployee,
  getSalaryDetail,
  updateSalary,
  updateSalaryStatus,
  processLoanDeductions,
} = require('../../../../controllers/app/payroll/salary.controller');

router.post(subPaths.generateSalaryOfAllEmployees, generateSalaryOfAllEmployees);
router.get(subPaths.getSalaryHistoryOfAllEmployees, getSalaryHistoryOfAllEmployees);
router.get(subPaths.getSalaryHistoryOfAnEmployee, getSalaryHistoryOfAnEmployee);
router.get(subPaths.getSalaryDetail, getSalaryDetail);
router.put(subPaths.updateSalary, updateSalary);
router.put(subPaths.updateSalaryStatus, updateSalaryStatus);
router.put(subPaths.processLoanDeductions, processLoanDeductions);

module.exports = router; 