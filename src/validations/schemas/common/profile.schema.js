const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.profile = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.profile.path,
    v1.routes.profile.subPaths.root,
  ].join('')]: {
    [GET]: Joi.object({}),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.profile.path,
    v1.routes.profile.subPaths.updateProfile,
  ].join('')]: {
    [PUT]: Joi.object({
      profilePicUrl: Joi.string().allow(null, '').optional(),
      firstName: Joi.string().max(100).allow(null, '').optional(),
      lastName: Joi.string().max(100).allow(null, '').optional(),
      email: Joi.string().email().allow(null, '').optional(),
      phone: Joi.string().max(20).allow(null, '').optional(),
      position: Joi.string().max(200).allow(null, '').optional()
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.profile.path,
    v1.routes.profile.subPaths.updateCompany,
  ].join('')]: {
    [PUT]: Joi.object({
      companyName: Joi.string().max(100).allow(null, '').optional(),
      companyLogoUrl: Joi.string().allow(null, '').optional(),
      companyAddress: Joi.string().max(200).allow(null, '').optional(),
      companyPhone: Joi.string().max(20).allow(null, '').optional(),
      companyEmail: Joi.string().email().allow(null, '').optional(),
      companyWebsite: Joi.string().allow(null, '').optional(),
      companyTaxNumber: Joi.string().max(50).allow(null, '').optional(),
    }),
  },

};
