const { mongoConfig } = require('./mongo.config');
const { dbConfig } = require('./db.config');
const { errorHandlerConfig } = require('./errorHandler.config');
const { errorLoggerConfig } = require('./errorLogger.config');
const { routesConfig } = require('./route.config');

module.exports = {
  mongoConfig,
  dbConfig,
  routesConfig,
  errorHandlerConfig,
  errorLoggerConfig,
};
