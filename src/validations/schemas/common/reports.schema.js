const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.reports = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.reports.path,
    v1.routes.reports.subPaths.docxToPdfConvert,
  ].join('')]: {
    [POST]: Joi.object({
      templateData: Joi.object().required(),
      templateType: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.reports.path,
    v1.routes.reports.subPaths.expenseReport,
  ].join('')]: {
    [GET]: Joi.object({
      catagory: Joi.string().optional(),
      directorId: Joi.string().optional(),
      employeeId: Joi.string().optional(),
      fromDate: Joi.date().optional(),
      toDate: Joi.date().optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.reports.path,
    v1.routes.reports.subPaths.getTotalEmployeeVendorCustomer,
  ].join('')]: {
    [GET]: Joi.object({}),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.reports.path,
    v1.routes.reports.subPaths.getMonthlySalaryReport,
  ].join('')]: {
    [GET]: Joi.object({
      month: Joi.number().integer().min(1).max(12).optional(),
      year: Joi.number().integer().min(2000).max(2100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.reports.path,
    v1.routes.reports.subPaths.getRemainingBalanceReport,
  ].join('')]: {
    [GET]: Joi.object({}),
  },
};
