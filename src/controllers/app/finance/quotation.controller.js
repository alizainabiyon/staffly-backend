// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const QuotationModel = require('../../../models/mongodb/app/Quotation.model');
const CustomerModel = require('../../../models/mongodb/app/Customer.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');
const { random } = require('lodash');

const quotation = {};

quotation.createQuotation = async (req, res, next) => {
  const { 
    contractorId,
    customerId,
    description,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    currency,
    terms,
    notes,
    status,
    attachments
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await QuotationModel.createQuotation({
      quotationId: `quotation-${uuid()}`,
      userID,
      contractorId,
      customerId,
      quotationNumber: `QUO-${random(100000, 999999)}`,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      currency,
      terms,
      notes,
      status,
      attachments,
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

quotation.getAllQuotations = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    contractorId,
    customerId,
    status, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await QuotationModel.getAllQuotations({
      userID,
      contractorId,
      customerId,
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

quotation.getQuotationById = async (req, res, next) => {
  const { userID } = res.auth;
  const { quotationId } = req.query;

  try {
    const { success, message, data } = await QuotationModel.getQuotationById({
      userID,
      quotationId
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

quotation.getQuotationsByCustomer = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    customerId,
    status, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await QuotationModel.getQuotationsByCustomer({
      userID,
      customerId,
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

quotation.updateQuotation = async (req, res, next) => {
  const {  quotationId, contractorId, customerId, description, items, subtotal, taxAmount, discountAmount, totalAmount, currency, terms, notes, status, attachments
  } = req.body;
  const { userID } = res.auth;

  try {
    const updateQuotationDto = {
      quotationId,
      userID,
      contractorId,
      customerId,
      quotationNumber: `QUO-${random(100000, 999999)}`,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      currency,
      terms,
      notes,
      status,
      attachments,
      updatedBy: userID
    };
    
   

    const { success, message, data } = await QuotationModel.updateQuotation(updateQuotationDto);

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

quotation.updateQuotationStatus = async (req, res, next) => {
  const { quotationId, status } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await QuotationModel.updateQuotationStatus({
      userID,
      quotationId,
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

quotation.deleteQuotation = async (req, res, next) => {
  const { userID } = res.auth;
  const { quotationId } = req.query;

  try {
    const { success, message, data } = await QuotationModel.deleteQuotation({
      userID,
      quotationId
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

quotation.searchQuotations = async (req, res, next) => {
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
    const { success, message, data } = await QuotationModel.searchQuotations({
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

quotation.getQuotationStats = async (req, res, next) => {
  const { userID } = res.auth;
  const { contractorId } = req.query;

  try {
    const { success, message, data } = await QuotationModel.getQuotationStats({
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

quotation.convertToInvoice = async (req, res, next) => {
  const { quotationId } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await QuotationModel.convertToInvoice({
      userID,
      quotationId,
      convertedBy: userID
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

module.exports = quotation; 