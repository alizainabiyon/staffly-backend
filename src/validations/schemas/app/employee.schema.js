const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.employee = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.create,
  ].join('')]: {
    [POST]: Joi.object({
      employeeId: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      address2: Joi.string().allow('', null).optional(),
      age: Joi.number().allow(null).optional(),
      cnic: Joi.string().allow('', null).optional(),
      cast: Joi.string().allow('', null).optional(),
      department: Joi.string().allow('', null).optional(),
      position: Joi.string().allow('', null).optional(),
      joinDate: Joi.string().allow('', null).optional(),
      status: Joi.string().valid('active', 'inactive', 'terminated').default('active'),
      salary: Joi.number().allow(null).optional(),
      study: Joi.string().allow('', null).optional(),
      profilePic: Joi.string().allow('', null).optional(),
      bankAccount: Joi.string().allow('', null).optional(),
      leaves: Joi.object().allow('', null).optional(),
      attendance: Joi.object().allow('', null).optional(),
      advances: Joi.array().allow('', null).optional(),
      loans: Joi.array().allow('', null).optional(),

      emergencyContacts: Joi.array().items(
        Joi.object({
          name: Joi.string().allow('', null).optional(),
          phone: Joi.string().allow('', null).optional(),
          relation: Joi.string().allow('', null).optional(),
          occupation: Joi.string().allow('', null).optional(),
        })
      ).default([]),
  
      experiences: Joi.array().items(
        Joi.object({
          title: Joi.string().allow('', null).optional(),
          description: Joi.string().allow('', null).optional(),
          address: Joi.string().allow('', null).optional(),
          from: Joi.string().allow('', null).optional(),
          to: Joi.string().allow('', null).optional(),
        })
      ).default([]),
  
      documents: Joi.array().items(
        Joi.object({
          name: Joi.string().allow('', null).optional(),
          file: Joi.string().allow('', null).optional(),
          type: Joi.string().allow('', null).optional(),
          url: Joi.string().allow('', null).optional(),
          uploadedAt: Joi.date().default(Date.now),
        })
      ).default([]),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.update,
  ].join('')]: {
    [PUT]: Joi.object({
      employeeId: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      address2: Joi.string().allow('', null).optional(),
      age: Joi.number().allow(null).optional(),
      cnic: Joi.string().allow('', null).optional(),
      cast: Joi.string().allow('', null).optional(),
      department: Joi.string().allow('', null).optional(),
      position: Joi.string().allow('', null).optional(),
      joinDate: Joi.string().allow('', null).optional(),
      status: Joi.string().valid('active', 'inactive', 'terminated').default('active'),
      salary: Joi.number().allow(null).optional(),
      study: Joi.string().allow('', null).optional(),
      profilePic: Joi.string().allow('', null).optional(),
      bankAccount: Joi.string().allow('', null).optional(),

      emergencyContacts: Joi.array().items(
        Joi.object({
          name: Joi.string().allow('', null).optional(),
          phone: Joi.string().allow('', null).optional(),
          relation: Joi.string().allow('', null).optional(),
          occupation: Joi.string().allow('', null).optional(),
        })
      ).default([]),
  
      experiences: Joi.array().items(
        Joi.object({
          title: Joi.string().allow('', null).optional(),
          description: Joi.string().allow('', null).optional(),
          address: Joi.string().allow('', null).optional(),
          from: Joi.string().allow('', null).optional(),
          to: Joi.string().allow('', null).optional(),
        })
      ).default([]),
  
      documents: Joi.array().items(
        Joi.object({
          name: Joi.string().allow('', null).optional(),
          file: Joi.string().allow('', null).optional(),
          type: Joi.string().allow('', null).optional(),
          url: Joi.string().allow('', null).optional(),
          uploadedAt: Joi.date().default(Date.now),
        })
      ).default([]),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.getAllEmployees,
  ].join('')]: {
    [GET]: Joi.object({
      search: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'terminated').optional(),
      dateFrom: Joi.string().isoDate().optional(),
      dateTo: Joi.string().isoDate().optional(),
      category: Joi.string().optional(),
      department: Joi.string().optional(),
      sortBy: Joi.string().valid('name', 'email', 'department', 'position', 'joinDate', 'createdAt', 'salary').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.getEmployeeById,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.delete,
  ].join('')]: {
    [DELETE]: Joi.object({
      employeeId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.employee.path,
    v1.routes.employee.subPaths.getEmployeeExpenses,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().required(),
      month: Joi.number().integer().min(1).max(12).optional(),
      year: Joi.number().integer().min(2000).max(2100).optional(),
    }),
  },
};
