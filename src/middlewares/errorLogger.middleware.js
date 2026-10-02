const log4js = require('log4js');
const { traceLogConfig } = require('../lib/configs').errorLoggerConfig;

log4js.configure(traceLogConfig);
const logger = log4js.getLogger();

exports.errorLogger = (err, req, res, next) => {
  logger.error(err);
  next(err);
};
