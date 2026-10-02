const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.director = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.director.path,
    v1.routes.director.subPaths.createDirector,
  ].join('')]: {
    [POST]: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).required(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'resigned').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.director.path,
    v1.routes.director.subPaths.getAllDirectors,
  ].join('')]: {
    [GET]: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'resigned').optional(),
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
    v1.routes.director.path,
    v1.routes.director.subPaths.getDirectorById,
  ].join('')]: {
    [GET]: Joi.object({
      directorId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.director.path,
    v1.routes.director.subPaths.updateDirector,
  ].join('')]: {
    [PUT]: Joi.object({
      directorId: Joi.string().required(),
      name: Joi.string().min(2).max(100).optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(15).optional(),
      alternatePhone: Joi.string().min(10).max(15).optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'resigned').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.director.path,
    v1.routes.director.subPaths.deleteDirector,
  ].join('')]: {
    [DELETE]: Joi.object({
      directorId: Joi.string().required(),
    }),
  },
}; 