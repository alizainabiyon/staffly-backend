const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.contractor = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.createContractor,
  ].join('')]: {
    [POST]: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      companyName: Joi.string().min(2).max(100).optional(),
      type: Joi.string().valid('individual', 'company', 'partnership', 'corporation').optional(),
      category: Joi.string().max(100).optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      website: Joi.string().optional(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      industry: Joi.string().max(100).optional(),
      specializations: Joi.array().items(Joi.string().max(100)).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.getAllContractors,
  ].join('')]: {
    [GET]: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      type: Joi.string().valid('individual', 'company', 'partnership', 'corporation').optional(),
      category: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      industry: Joi.string().optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'city', 'country').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.getContractorById,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.updateContractor,
  ].join('')]: {
    [PUT]: Joi.object({
      contractorId: Joi.string().required(),
      name: Joi.string().min(2).max(100).optional(),
      companyName: Joi.string().min(2).max(100).optional(),
      type: Joi.string().valid('individual', 'company', 'partnership', 'corporation').optional(),
      category: Joi.string().max(100).optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      website: Joi.string().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      industry: Joi.string().max(100).optional(),
      specializations: Joi.array().items(Joi.string().max(100)).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.deleteContractor,
  ].join('')]: {
    [DELETE]: Joi.object({
      contractorId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.searchContractors,
  ].join('')]: {
    [GET]: Joi.object({
      searchTerm: Joi.string().min(2).required(),
      category: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      industry: Joi.string().optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email', 'city', 'country').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.contractor.path,
    v1.routes.contractor.subPaths.getContractorStats,
  ].join('')]: {
    [GET]: Joi.object({}),
  },
}; 