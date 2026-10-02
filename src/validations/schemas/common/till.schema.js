const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.till = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.till.path,
    v1.routes.till.subPaths.initializeTill,
  ].join('')]: {
    [POST]: Joi.object({
      totalAmount: Joi.number().min(0).required(),
      cashAmount: Joi.number().min(0).required(),
      bankAmount: Joi.number().min(0).required()
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.till.path,
    v1.routes.till.subPaths.getTill,
  ].join('')]: {
    [GET]: Joi.object({
      ledgerType: Joi.string().valid('till', 'director', 'all').required(),
      directorId: Joi.string().optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.till.path,
    v1.routes.till.subPaths.updateTill,
  ].join('')]: {
    [PUT]: Joi.object({
      totalAmount: Joi.number().min(0).optional(),
      cashAmount: Joi.number().min(0).optional(),
      bankAmount: Joi.number().min(0).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.till.path,
    v1.routes.till.subPaths.deleteTill,
  ].join('')]: {
    [DELETE]: Joi.object({}),
  },
};
