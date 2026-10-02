// @Dependencies
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

// @Models
const UserModel = require('../../models/mongodb/auth/User.model');
const TokenModel = require('../../models/mongodb/auth/JwtToken.model');

// @Helper Functions
const {
  jwtManager: { generateToken },
  successResponse,
  errorResponse,
} = require('../../utils/helperFunctions');

// @Constants
const {
  errorCode: { ER_DUP_ENTRY, INVALID_EMAIL, INVALID_PASSWORD },
} = require('../../constants');

const user = {};

user.signUp = async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  email = email.toLowerCase();
  password = await bcrypt.hash(password, 10);

  try {
    let data = await UserModel.findOne({ email });
    if (data) throw errorResponse(ER_DUP_ENTRY);

    // save to the mongoDB
    const userData = {
      userID: `user-${uuid()}`,
      firstName,
      lastName,
      email,
      password,
    };

    const user = new UserModel(userData);
    let result = await user.save();

    return successResponse({
      res,
      code: 200,
      message: 'Sign Up succeed.',
      data: {
        userID: result.userID,
      },
    });
  } catch (e) {
    next(e);
  }
};

user.signIn = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    let data = await UserModel.findOne({ email }).lean();
    if (!data) throw errorResponse(INVALID_EMAIL);

    const result = await bcrypt.compare(password, data.password);
    if (!result) throw errorResponse(INVALID_PASSWORD);

    const jwtDTO = {
      id: data.userID,
    };
    const token = await generateToken(jwtDTO);
    // if (token) {
    //   const tokenDto = {
    //     tokenID: `token-${uuid()}`,
    //     userID: data.userID,
    //     token: token,
    //   };
    //   await new TokenModel(tokenDto).save();
    // }

    const responseData = {
      userID: data.userID,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      profilePicUrl: data.profilePicUrl,
      companyName: data.companyName,
      companyLogoUrl: data.companyLogoUrl,
      companyAddress: data.companyAddress,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      companyWebsite: data.companyWebsite,
      token,
    };

    delete data.password;

    return successResponse({
      res,
      code: 200,
      message: 'Login successfully!',
      data: responseData,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = user;
