const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
  randomConstant: {
    JWT_SECRET_CODE_V1,
    JWT_EXPIRY,
    EMAIL_VERIFICATION_JWT_SECRET_CODE,
  },
} = require('../../constants');
const { promisify } = require('util');

exports.jwtManager = {
  async generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET_CODE_V1, {
      expiresIn: '10000h' || JWT_EXPIRY,
    }); // eslint-disable-line
  },

  async verifyToken(token) {
    let auth = {};
    auth.isVarify = false;
    await jwt.verify(token, JWT_SECRET_CODE_V1, (err, authData) => {
      // eslint-disable-line
      if (err) {
        console.log('JWT did not validate the token');
        console.log(err);
      } else {
        // if (authData._uid == _uid) {
        console.log('JWT validated the token');
        auth.authData = authData;
        auth.isVarify = true;
        // }
        // else console.log("JWT token varified BUT WRONG UID")
      }
    });
    return auth;
  },

  generateJWTSecret(email) {
    const emailHash = crypto.createHash('md5').update(email).digest('hex');
    return emailHash + EMAIL_VERIFICATION_JWT_SECRET_CODE + emailHash;
  },

  generateVerificationToken(email) {
    const emailHash = crypto.createHash('md5').update(email).digest('hex');
    const JWTSecret =
      emailHash + EMAIL_VERIFICATION_JWT_SECRET_CODE + emailHash;
    return jwt.sign({ email }, JWTSecret, {
      expiresIn: '24h',
    });
  },

  jwtDecode: promisify(jwt.verify),
};
