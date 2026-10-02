const { errorCode } = require('../constants');

const { AUTHORIZATION_ERROR } = errorCode;

exports.authorization = (req, res, next) => {
  try {
    const userID = req.headers['x-user-id'];

    if (userID && userID.length && typeof userID !== 'undefined') {
      console.log(`Internal Request: Authorized.`);
      res.auth = {
        userID,
        id: userID,
      };
      next();
    } else {
      let error = new Error();
      error.code = AUTHORIZATION_ERROR;
      throw error;
    }
  } catch (e) {
    next(e);
  }
};
