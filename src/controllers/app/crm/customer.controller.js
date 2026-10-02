// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const CustomerModel = require('../../../models/mongodb/app/Customer.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const customer = {};

customer.createCustomer = async (req, res, next) => {
  const {  contractorId, name, company, customerType, email, phone, otherContactNo, website, address, city, country, officeAddress, taxNumber, contactPerson, notes, tags, status
  } = req.body;
  const { userID } = res.auth;

  try {
    const customerDto = {
      customerId: `customer-${uuid()}`,
      userID,
      contractorId,
      name,
      company,
      customerType,
      email,
      phone,
      otherContactNo,
      website,
      address,
      city,
      country,
      officeAddress,
      taxNumber,
      contactPerson,
      notes,
      tags,
      status,
      createdBy: userID
    }
    const { success, message, data } = await CustomerModel.createCustomer(customerDto);

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
customer.updateCustomer = async (req, res, next) => {
  const { customerId, contractorId, name, company, customerType, email, phone, otherContactNo, website, address, city, country, officeAddress, taxNumber, contactPerson, notes, tags, status
  } = req.body;
  const { userID } = res.auth;

  try {
      let updateCustomerDto = {
        userID,
      contractorId,
      name,
      company,
      customerType,
      email,
      phone,
      otherContactNo,
      website,
      address,
      city,
      country,
      officeAddress,
      taxNumber,
      contactPerson,
      notes,
      tags,
      status
    }

    const { success, message, data } = await CustomerModel.updateCustomer({
      userID,
      customerId,
      updateCustomerDto
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
customer.getCustomerById = async (req, res, next) => {
  const { userID } = res.auth;
  const { customerId } = req.query;

  try {
    const { success, message, data } = await CustomerModel.getCustomerById({
      userID,
      customerId
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
customer.getAllCustomers = async (req, res, next) => {
  const { } = req.query;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await CustomerModel.getAllCustomers(userID);

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
customer.deleteCustomer = async (req, res, next) => {
  const { customerId } = req.query;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await CustomerModel.deleteCustomer({
      userID,
      customerId
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

// not integrated yet

customer.getCustomersByContractor = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    contractorId,
    status, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await CustomerModel.getCustomersByContractor({
      userID,
      contractorId,
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
customer.updateCustomerStatus = async (req, res, next) => {
  const { customerId, status } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await CustomerModel.updateCustomerStatus({
      userID,
      customerId,
      status,
      updatedBy: userID
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
customer.searchCustomers = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    searchTerm,
    contractorId,
    status, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await CustomerModel.searchCustomers({
      userID,
      searchTerm,
      contractorId,
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
customer.getCustomerStats = async (req, res, next) => {
  const { userID } = res.auth;
  const { contractorId } = req.query;

  try {
    const { success, message, data } = await CustomerModel.getCustomerStats({
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

module.exports = customer; 