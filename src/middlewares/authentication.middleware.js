const { errorCode } = require('../constants');

// @Helper Functions
const {
  jwtManager: { verifyToken },
} = require('../utils/helperFunctions/jwtManager');

// const { JWT_SECRET_CODE_V1 } = randomConstant;
const { AUTHENTICATION_TOKEN_NOT_FOUND, INTERNAL_AUTHENTICATION_ERROR } =
  errorCode;

exports.authentication = async (req, res, next) => {
  try {
    const authenticationHeader = req.headers['authorization'];
    if (typeof authenticationHeader !== 'undefined') {
      const token = authenticationHeader.split(' ')[1];
      const { isVarify, authData } = await verifyToken(token);
      if (isVarify) {
        console.log(`Internal Request: Authenticated.`);
        req.headers['x-user-id'] = authData.id;
        next();
      } else {
        let error = new Error();
        error.code = INTERNAL_AUTHENTICATION_ERROR;
        throw error;
      }
    } else {
      let error = new Error();
      error.code = AUTHENTICATION_TOKEN_NOT_FOUND;
      throw error;
    }
  } catch (e) {
    next(e);
  }
};
