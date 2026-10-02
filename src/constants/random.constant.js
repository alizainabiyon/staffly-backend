exports.randomConstant = {
  // PORT: 8080,
  PORT: process.env.PORT || 4242,
  JWT_EXPIRY: '10000h',
  // MD5 of Sittingducks.123!
  JWT_SECRET_CODE_V1: '1f1ba1c6ca0ccb6f9e6ac372eaa8eba4',

  // FROM_EMAILS: {
  //   NO_REPLY: process.env.FROM_EMAILS,
  // },
  // FROM_NAME: {
  //   CASFLOW: 'Cashflow Inovator'
  // }
};
