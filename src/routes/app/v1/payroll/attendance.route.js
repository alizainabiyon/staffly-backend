const router = require('express').Router();
const { routesConfig } = require('../../../../lib/configs');

const { subPaths } = routesConfig.app.versions.v1.routes.attendance;
const {
  markAttendanceOfAllEmployees,
  updateAttendanceOfAllEmployees,
  getOneDayAttendanceOfAllEmployees,
  getAttendanceDetailOfOneEmployee,
  getAttendanceById,
  getFullMonthAttendanceOfOneEmployee,
  getFullMonthAttendanceOfAllEmployee,
  deleteAttendance,
} = require('../../../../controllers/app/payroll/attendance.controller');

router.post(subPaths.markAttendanceOfAllEmployees, markAttendanceOfAllEmployees);
router.put(subPaths.updateAttendanceOfAllEmployees, updateAttendanceOfAllEmployees);
router.get(subPaths.getOneDayAttendanceOfAllEmployees, getOneDayAttendanceOfAllEmployees);
router.get(subPaths.getAttendanceDetailOfOneEmployee, getAttendanceDetailOfOneEmployee);
router.get(subPaths.getAttendanceById, getAttendanceById);
router.get(subPaths.getFullMonthAttendanceOfOneEmployee, getFullMonthAttendanceOfOneEmployee);
router.get(subPaths.getFullMonthAttendanceOfAllEmployee, getFullMonthAttendanceOfAllEmployee);
router.delete(subPaths.deleteAttendance, deleteAttendance);

module.exports = router; 