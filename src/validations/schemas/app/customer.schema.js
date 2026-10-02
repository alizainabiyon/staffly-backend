const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.customer = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.createCustomer,
  ].join('')]: {
    [POST]: Joi.object({
      contractorId: Joi.string().allow(null, "").optional(),
      name: Joi.string().min(2).max(100).required(),
      company: Joi.string().max(100).optional(),
      customerType: Joi.string().valid('individual', 'business').optional(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(15).required(),
      otherContactNo: Joi.string().min(10).max(15).allow(null, "").optional(),
      website: Joi.string().allow(null, "").optional(),
      address: Joi.string().max(200).allow(null, "").optional(),
      city: Joi.string().max(100).allow(null, "").optional(),
      country: Joi.string().max(100).allow(null, "").optional(),
      officeAddress: Joi.string().max(200).allow(null, "").optional(),
      taxNumber: Joi.string().max(50).allow(null, "").optional(),
      contactPerson: Joi.string().max(100).allow(null, "").optional(),
      notes: Joi.string().max(1000).allow(null, "").optional(),
      tags: Joi.array().items(Joi.string().max(50)).allow(null, "").optional(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.getAllCustomers,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      customerType: Joi.string().valid('individual', 'business').optional(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').optional(),
      tags: Joi.string().optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'status').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.getCustomerById,
  ].join('')]: {
    [GET]: Joi.object({
      customerId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.getCustomersByContractor,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().required(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'status').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.updateCustomer,
  ].join('')]: {
    [PUT]: Joi.object({
      customerId: Joi.string().required(),
      contractorId: Joi.string().allow(null, "").optional(),
      name: Joi.string().min(2).max(100).required(),
      company: Joi.string().max(100).optional(),
      customerType: Joi.string().valid('individual', 'business').optional(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(15).required(),
      otherContactNo: Joi.string().min(10).max(15).allow(null, "").optional(),
      website: Joi.string().allow(null, "").optional(),
      address: Joi.string().max(200).allow(null, "").optional(),
      city: Joi.string().max(100).allow(null, "").optional(),
      country: Joi.string().max(100).allow(null, "").optional(),
      officeAddress: Joi.string().max(200).allow(null, "").optional(),
      taxNumber: Joi.string().max(50).allow(null, "").optional(),
      contactPerson: Joi.string().max(100).allow(null, "").optional(),
      notes: Joi.string().max(1000).allow(null, "").optional(),
      tags: Joi.array().items(Joi.string().max(50)).allow(null, "").optional(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.updateCustomerStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      customerId: Joi.string().required(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.deleteCustomer,
  ].join('')]: {
    [DELETE]: Joi.object({
      customerId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.searchCustomers,
  ].join('')]: {
    [GET]: Joi.object({
      searchTerm: Joi.string().min(2).required(),
      contractorId: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'prospect', 'lead', 'suspended').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'status').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.customer.path,
    v1.routes.customer.subPaths.getCustomerStats,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
    }),
  },
}; 