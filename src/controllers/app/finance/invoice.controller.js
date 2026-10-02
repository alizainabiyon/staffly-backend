// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const InvoiceModel = require('../../../models/mongodb/app/Invoice.model');
const CustomerModel = require('../../../models/mongodb/app/Customer.model');
const LedgerModel = require('../../../models/mongodb/app/Ledger.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');
const { random } = require('lodash');

const invoice = {};

invoice.createInvoice = async (req, res, next) => {
  const { 
    contractorId,
    customerId,
    description,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    advanceAmount,
    currency,
    terms,
    notes,
    status,
    attachments
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await InvoiceModel.createInvoice({
      invoiceId: `inv-${uuid()}`,
      userID,
      contractorId,
      customerId,
      invoiceNumber: `INV-${random(100000, 999999)}`,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      advanceAmount: parseFloat(advanceAmount) || 0,
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

invoice.getAllInvoices = async (req, res, next) => {
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
    const { success, message, data } = await InvoiceModel.getAllInvoices({
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

invoice.getInvoiceById = async (req, res, next) => {
  const { userID } = res.auth;
  const { invoiceId } = req.query;

  try {
    const { success, message, data } = await InvoiceModel.getInvoiceById({
      userID,
      invoiceId
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

invoice.getInvoicesByCustomer = async (req, res, next) => {
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
    const { success, message, data } = await InvoiceModel.getInvoicesByCustomer({
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

invoice.updateInvoice = async (req, res, next) => {
  const { 
    invoiceId,
    invoiceNumber,
    contractorId,
    customerId,
    description,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    advanceAmount,
    currency,
    terms,
    notes,
    status,
    attachments
  } = req.body;
  const { userID } = res.auth;

  try {
    const updateInvoiceDto = {
      invoiceId,
      userID,
      contractorId,
      customerId,
      invoiceNumber,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      advanceAmount: parseFloat(advanceAmount) || 0,
      currency,
      terms,
      notes,
      status,
      attachments,
      updatedBy: userID
    };
   
    const { success, message, data } = await InvoiceModel.updateInvoice(updateInvoiceDto);

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

invoice.updateInvoiceStatus = async (req, res, next) => {
  const { invoiceId } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await InvoiceModel.updateInvoiceStatus({
      userID,
      invoiceId
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

invoice.deleteInvoice = async (req, res, next) => {
  const { userID } = res.auth;
  const { invoiceId } = req.query;

  try {
    const { success, message, data } = await InvoiceModel.deleteInvoice({
      userID,
      invoiceId
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

invoice.searchInvoices = async (req, res, next) => {
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
    const { success, message, data } = await InvoiceModel.searchInvoices({
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

invoice.getInvoiceStats = async (req, res, next) => {
  const { userID } = res.auth;
  const { contractorId } = req.query;

  try {
    const { success, message, data } = await InvoiceModel.getInvoiceStats({
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

invoice.createLedgerEntry = async (req, res, next) => {
  const { invoiceId } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await InvoiceModel.createLedgerEntry({
      userID,
      invoiceId,
      createdBy: userID
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

invoice.sendInvoice = async (req, res, next) => {
  const { invoiceId, sendMethod } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await InvoiceModel.sendInvoice({
      userID,
      invoiceId,
      sendMethod,
      sentBy: userID
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

module.exports = invoice; 