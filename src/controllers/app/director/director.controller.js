// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const DirectorModel = require('../../../models/mongodb/app/Director.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const director = {};

director.createDirector = async (req, res, next) => {
  const { 
    name,
    email,
    phone,
    alternatePhone,
    address,
    city,
    country,
    postalCode,
    status
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await DirectorModel.createDirector({
      directorId: `dir-${uuid()}`,
      userID,
      name,
      email,
      phone,
      alternatePhone,
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

director.getAllDirectors = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    name, 
    email, 
    status,
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await DirectorModel.getAllDirectors({
      userID,
      name,
      email,
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

director.getDirectorById = async (req, res, next) => {
  const { userID } = res.auth;
  const { directorId } = req.query;

  try {
    const { success, message, data } = await DirectorModel.getDirectorById({
      userID,
      directorId
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

director.updateDirector = async (req, res, next) => {
  const { 
    directorId,
    name,
    email,
    phone,
    alternatePhone,
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
      email,
      phone,
      alternatePhone,
      address,
      city,
      country,
      postalCode,
      status,
      updatedBy: userID
    };

    const { success, message, data } = await DirectorModel.updateDirector({
      userID,
      directorId,
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

director.deleteDirector = async (req, res, next) => {
  const { userID } = res.auth;
  const { directorId } = req.query;

  try {
    const { success, message } = await DirectorModel.deleteDirector({
      userID,
      directorId
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

module.exports = director; 