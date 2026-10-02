// @utils
const ErrorResponse =
  require('../utils/helperFunctions/requestResponse').errorResponse;

// @Constants
const { errorConstants } = require('../constants');

// @Error Handler Middleware
//
exports.errorHandler = (err, req, res, next) => {
  // eslint-disable-line
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = errorConstants.DUPLICATE_KEY;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    status: {
      code: error.statusCode || 500,
      success: false,
    },

    error: error.message || ErrorMessage.SERVER_CRASHED, // eslint-disable-line
  });
};
