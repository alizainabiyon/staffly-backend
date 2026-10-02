// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const VendorModel = require('../../../models/mongodb/app/Vendor.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const vendor = {};

vendor.createVendor = async (req, res, next) => {
  const { 
    name,
    companyName,
    type,
    category,
    email,
    phone,
    alternatePhone,
    website,
    address,
    city,
    country,
    postalCode,
    status
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorModel.createVendor({
      vendorId: `ven-${uuid()}`,
      userID,
      name,
      companyName,
      type,
      category,
      email,
      phone,
      alternatePhone,
      website,
      address,
      city,
      country,
      postalCode,
      status,
      createdBy: userID
    });

    return successResponse({
      res,
      code: success ? 201 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

vendor.getAllVendors = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    name, 
    email, 
    type, 
    category, 
    status,
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await VendorModel.getAllVendors({
      userID,
      name,
      email,
      type,
      category,
      status,
      sortBy,
      sortOrder,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });

    return successResponse({
      res,
      code: 200,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

vendor.getVendorById = async (req, res, next) => {
  const { userID } = res.auth;
  const { vendorId } = req.query;

  try {
    const { success, message, data } = await VendorModel.getVendorById({
      userID,
      vendorId
    });

    return successResponse({
      res,
      code: 200,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

vendor.updateVendor = async (req, res, next) => {
  const { 
    vendorId,
    name,
    companyName,
    type,
    category,
    email,
    phone,
    alternatePhone,
    website,
    address,
    city,
    country,
    postalCode,
    status
  } = req.body;
  const { userID } = res.auth;

  try {
    const updateData = {
      name,
      companyName,
      type,
      category,
      email,
      phone,
      alternatePhone,
      website,
      address,
      city,
      country,
      postalCode,
      status,
      updatedBy: userID
    };

    const { success, message, data } = await VendorModel.updateVendor({
      userID,
      vendorId,
      updateData
    });

    return successResponse({
      res,
      code: 200,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

vendor.deleteVendor = async (req, res, next) => {
  const { userID } = res.auth;
  const { vendorId } = req.query;

  try {
    const { success, message } = await VendorModel.deleteVendor({
      userID,
      vendorId
    });

    return successResponse({
      res,
      code: 200,
      message: message,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = vendor; 