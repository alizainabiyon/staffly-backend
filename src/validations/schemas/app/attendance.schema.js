const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.attendance = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.markAttendanceOfAllEmployees,
  ].join('')]: {
    [POST]: Joi.object({
      date: Joi.date().required(),
      day: Joi.string().optional(),
      attendance: Joi.array().items(
        Joi.object({
          employeeId: Joi.string().required(),
          checkInTime: Joi.date().allow(null, '').optional(),
          checkOutTime: Joi.date().allow(null, '').optional(),
          workingHours: Joi.number().min(0).max(24).default(0),
          overTime: Joi.number().min(0).max(24).default(0),
          attendanceStatus: Joi.string().valid('present', 'absent', 'late', 'half-day', 'leave', 'holiday', 'weekend').default('present'),
          note: Joi.string().allow('', null).optional(),
        })
      ).min(1).required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.updateAttendanceOfAllEmployees,
  ].join('')]: {
    [PUT]: Joi.object({
      attendanceId: Joi.string().required(),
      date: Joi.date().optional(),
      day: Joi.string().optional(),
      attendance: Joi.array().items(
        Joi.object({
          employeeId: Joi.string().required(),
          checkInTime: Joi.date().allow(null, '').optional(),
          checkOutTime: Joi.date().allow(null, '').optional(),
          workingHours: Joi.number().min(0).max(24).default(0),
          overTime: Joi.number().min(0).max(24).default(0),
          attendanceStatus: Joi.string().valid('present', 'absent', 'late', 'half-day', 'leave').default('present'),
          note: Joi.string().allow('', null).optional(),
        })
      ).min(1).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.getOneDayAttendanceOfAllEmployees,
  ].join('')]: {
    [GET]: Joi.object({
      date: Joi.date().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.getAttendanceDetailOfOneEmployee,
  ].join('')]: {
    [GET]: Joi.object({
      attendanceId: Joi.string().required(),
      employeeId: Joi.string().required(),
    }),
  },

  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.getAttendanceById,
  ].join('')]: {
    [GET]: Joi.object({
      attendanceId: Joi.string().required(),
    }),
  },

  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.getFullMonthAttendanceOfOneEmployee,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().required(),
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().min(2000).max(2100).required(),
    }),
  },

  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.getFullMonthAttendanceOfAllEmployee,
  ].join('')]: {
    [GET]: Joi.object({
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().min(2000).max(2100).required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.attendance.path,
    v1.routes.attendance.subPaths.deleteAttendance,
  ].join('')]: {
    [DELETE]: Joi.object({
      attendanceId: Joi.string().required(),
    }),
  },
}; 