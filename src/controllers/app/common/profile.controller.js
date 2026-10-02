// @Dependencies

// @Models
const UserModel = require('../../../models/mongodb/auth/User.model');

// @Helper Functions
const { successResponse, errorResponse } = require('../../../utils/helperFunctions');

// hello
const profile = {};

profile.get = async (req, res, next) => {
  // let {  } = req.query;
  const { userID } = res.auth;

  try {
    return successResponse({
      res,
      code: 200,
      message: 'User profile get succeed.',
      data: await UserModel.findOne({ userID }).select(
        'userID firstName lastName email phone position profilePicUrl companyName companyDescription companyLogoUrl companyAddress companyPhone companyEmail companyWebsite companyTaxNumber'
      ),
    });
  } catch (e) {
    next(e);
  }
};

profile.updateProfile = async (req, res, next) => {
  const { userID } = res.auth;
  const { profilePicUrl, firstName, lastName, email, phone, position } = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { userID },
      { profilePicUrl, firstName, lastName, email, phone, position },
      { new: true }
    ).select('userID firstName lastName email phone position profilePicUrl companyName companyDescription companyLogoUrl companyAddress companyPhone companyEmail companyWebsite companyTaxNumber');

    if (!updatedUser) {
     throw errorResponse(DATA_NOT_FOUND);
    }

    return successResponse({
      res,
      code: 200,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  } catch (e) {
    next(e);
  }
};

profile.updateCompany = async (req, res, next) => {
  const { userID } = res.auth;
  const {
    companyName,
    companyLogoUrl,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    companyTaxNumber,
  } = req.body;

  try {
    const updateData = {};
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyLogoUrl !== undefined) updateData.companyLogoUrl = companyLogoUrl;
    if (companyAddress !== undefined) updateData.companyAddress = companyAddress;
    if (companyPhone !== undefined) updateData.companyPhone = companyPhone;
    if (companyEmail !== undefined) updateData.companyEmail = companyEmail;
    if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
    if (companyTaxNumber !== undefined) updateData.companyTaxNumber = companyTaxNumber;

    const updatedUser = await UserModel.findOneAndUpdate(
      { userID },
      updateData,
      { new: true }
    ).select('userID companyName companyLogoUrl companyAddress companyPhone companyEmail companyWebsite companyTaxNumber');

    if (!updatedUser) {
      throw errorResponse(DATA_NOT_FOUND);
    }

    return successResponse({
      res,
      code: 200,
      message: 'Company profile updated successfully.',
      data: updatedUser,
    });
  } catch (e) {
    next(e);
  }
};



module.exports = profile;
