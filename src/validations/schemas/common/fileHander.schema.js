const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs')
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods;

exports.fileHandler = {
    [[baseURL, app.path, v1.path, v1.routes.fileHandler.path, v1.routes.fileHandler.subPaths.uploadSingleFile].join('')]: {
        [POST]: Joi.object({
            file: Joi.any().optional(),
        }),
    },
    [[baseURL, app.path, v1.path, v1.routes.fileHandler.path, v1.routes.fileHandler.subPaths.uploadMultipleFiles].join('')]: {
        [POST]: Joi.object({
            files: Joi.any().optional(),
        })
    },
    [[baseURL, app.path, v1.path, v1.routes.fileHandler.path, v1.routes.fileHandler.subPaths.deleteSingleFile].join('')]: {
        [POST]: Joi.object({
            fileUrl: Joi.string().required(),
        })
    },
    [[baseURL, app.path, v1.path, v1.routes.fileHandler.path, v1.routes.fileHandler.subPaths.deleteMultipleFiles].join('')]: {
        [POST]: Joi.object({
            fileUrls: Joi.array().required(),
        })
    },


}
