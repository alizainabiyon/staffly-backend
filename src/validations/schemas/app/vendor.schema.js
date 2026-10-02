const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.vendor = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendor.path,
    v1.routes.vendor.subPaths.createVendor,
  ].join('')]: {
    [POST]: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      companyName: Joi.string().max(100).optional(),
      type: Joi.string().valid('individual', 'company', 'organization').optional(),
      category: Joi.string().valid('supplier', 'service_provider', 'manufacturer', 'distributor', 'wholesaler').optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      website: Joi.string().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'blacklisted').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendor.path,
    v1.routes.vendor.subPaths.getAllVendors,
  ].join('')]: {
    [GET]: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      type: Joi.string().valid('individual', 'company', 'organization').optional(),
      category: Joi.string().valid('supplier', 'service_provider', 'manufacturer', 'distributor', 'wholesaler').optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'blacklisted').optional(),
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
    v1.routes.vendor.path,
    v1.routes.vendor.subPaths.getVendorById,
  ].join('')]: {
    [GET]: Joi.object({
      vendorId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendor.path,
    v1.routes.vendor.subPaths.updateVendor,
  ].join('')]: {
    [PUT]: Joi.object({
      vendorId: Joi.string().required(),
      name: Joi.string().min(2).max(100).optional(),
      companyName: Joi.string().max(100).optional(),
      type: Joi.string().valid('individual', 'company', 'organization').optional(),
      category: Joi.string().valid('supplier', 'service_provider', 'manufacturer', 'distributor', 'wholesaler').optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      website: Joi.string().optional(),
      address: Joi.string().optional(),
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'blacklisted').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendor.path,
    v1.routes.vendor.subPaths.deleteVendor,
  ].join('')]: {
    [DELETE]: Joi.object({
      vendorId: Joi.string().required(),
    }),
  },
}; 