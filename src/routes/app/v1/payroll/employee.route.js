const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.employee;
const {
  create,
  update,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  getEmployeeExpenses,
} = require('../../../../controllers/app/payroll/employee.controller');

router.post(subPaths.create, create);
router.put(subPaths.update, update);
router.get(subPaths.getAllEmployees, getAllEmployees);
router.get(subPaths.getEmployeeById, getEmployeeById);
router.delete(subPaths.delete, deleteEmployee);
router.get(subPaths.getEmployeeExpenses, getEmployeeExpenses);

module.exports = router;