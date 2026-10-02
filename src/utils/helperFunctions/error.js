// @Generic Error Class
exports.newError = class newError extends Error {
  constructor({ code }) {
    super();
    this.code = code;
    this.date = new Date().now();
  }
};

exports.errorResponse = (code) => {
  const error = new Error();
  error.code = code;
  error.date = new Date();
  return error;
};

exports.returnError = (error) => {
  console.log(error);
  return {
    success: false,
    error,
  };
};

exports.errorDB = (message) => {
  const error = new Error();
  error.code = 'DB_OPERATION_FAILED';
  error.message = message;
  error.date = new Date();
  return error;
};
