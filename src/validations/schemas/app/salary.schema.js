const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.salary = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.generateSalaryOfAllEmployees,
  ].join('')]: {
    [POST]: Joi.object({
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().min(2000).max(2100).required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.getSalaryHistoryOfAllEmployees,
  ].join('')]: {
    [GET]: Joi.object({
      month: Joi.number().min(1).max(12).optional(),
      year: Joi.number().min(2000).max(2100).optional(),
      status: Joi.string().valid('pending', 'approved', 'paid', 'cancelled').optional()
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.getSalaryHistoryOfAnEmployee,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.getSalaryDetail,
  ].join('')]: {
    [GET]: Joi.object({
      salaryId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.updateSalary,
  ].join('')]: {
    [PUT]: Joi.object({
      salaryId: Joi.string().required(),
      basicSalary: Joi.number().min(0).optional(),
      overtimeAmount: Joi.number().min(0).optional(),
      deduction: Joi.array().items(
        Joi.object({
          date: Joi.date().required(),
          reason: Joi.string().required(),
          amount: Joi.number().min(0).required(),
          loanId: Joi.string().optional(),
          installmentNumber: Joi.number().optional(),
        })
      ).optional(),
      grossSalary: Joi.number().min(0).optional(),
      netSalary: Joi.number().min(0).optional(),
      remarks: Joi.string().allow('', null).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.updateSalaryStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      salaryId: Joi.string().required(),
      tillFrom: Joi.string().valid('till', 'director').required(),
      directorId: Joi.string().optional(),
      paymentMethod: Joi.string().valid('cash', 'bank').required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.salary.path,
    v1.routes.salary.subPaths.processLoanDeductions,
  ].join('')]: {
    [PUT]: Joi.object({
      salaryId: Joi.string().required(),
    }),
  },
}; 