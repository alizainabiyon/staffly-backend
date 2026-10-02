// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const ContractorModel = require('../../../models/mongodb/app/Contractor.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const contractor = {};

contractor.createContractor = async (req, res, next) => {
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
    industry,
    specializations
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await ContractorModel.createContractor({
      contractorId: `contractor-${uuid()}`,
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
      industry,
      specializations,
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

contractor.getAllContractors = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    name, 
    email, 
    type, 
    category, 
    city,
    country,
    industry,
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await ContractorModel.getAllContractors({
      userID,
      name,
      email,
      type,
      category,
      city,
      country,
      industry,
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

contractor.getContractorById = async (req, res, next) => {
  const { userID } = res.auth;
  const { contractorId } = req.query;

  try {
    const { success, message, data } = await ContractorModel.getContractorById({
      userID,
      contractorId
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

contractor.updateContractor = async (req, res, next) => {
  const { 
    contractorId,
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
    industry,
    specializations
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
      industry,
      specializations
    };
    

    const { success, message, data } = await ContractorModel.updateContractor({
      userID,
      contractorId,
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

contractor.deleteContractor = async (req, res, next) => {
  const { userID } = res.auth;
  const { contractorId } = req.query;

  try {
    const { success, message, data } = await ContractorModel.deleteContractor({
      userID,
      contractorId
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

contractor.searchContractors = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    searchTerm,
    category,
    city,
    country,
    industry,
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await ContractorModel.searchContractors({
      userID,
      searchTerm,
      category,
      city,
      country,
      industry,
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

contractor.getContractorStats = async (req, res, next) => {
  const { userID } = res.auth;

  try {
    const { success, message, data } = await ContractorModel.getContractorStats({
      userID
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

module.exports = contractor; 