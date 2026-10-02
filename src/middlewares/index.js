const { authentication } = require('./authentication.middleware');
const { authorization } = require('./authorization.middleware');
const { requestValidator } = require('./requestValidator.middleware');
const { errorHandler } = require('./errorHandler.middleware');
const { errorLogger } = require('./errorLogger.middleware');
const { dataLogger } = require('./dataLogger.middleware');
const { filesParser } = require('./fileParser.middleware');

module.exports = {
  authentication,
  authorization,
  requestValidator,
  errorHandler,
  errorLogger,
  dataLogger,
  filesParser,
};
