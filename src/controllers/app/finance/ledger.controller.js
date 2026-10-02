// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const LedgerModel = require('../../../models/mongodb/app/Ledger.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const ledger = {};

ledger.createLedgerEntry = async (req, res, next) => {
  const { 
    ledgerType,
    customerId,
    vendorId,
    directorId,
    transactions
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await LedgerModel.createLedgerEntry({
      ledgerId: `ledger-${uuid()}`,
      userID,
      ledgerType,
      customerId,
      vendorId,
      directorId,
      transactions,
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

ledger.getAllLedgerEntries = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    ledgerType,
    customerId,
    vendorId,
    directorId,
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await LedgerModel.getAllLedgerEntries({
      userID,
      ledgerType,
      customerId,
      vendorId,
      directorId,
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

ledger.getLedgerEntryById = async (req, res, next) => {
  const { userID } = res.auth;
  const { ledgerId } = req.query;

  try {
    const { success, message, data } = await LedgerModel.getLedgerEntryById({
      userID,
      ledgerId
    });

    return successResponse({
      res,
      code: success ? 200 : 404,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

ledger.updateLedgerEntry = async (req, res, next) => {
  const { 
    ledgerId,
    ledgerType,
    customerId,
    vendorId,
    directorId,
    transactions
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await LedgerModel.updateLedgerEntry({
      userID,
      ledgerId,
      updateData: {
        ledgerType,
        customerId,
        vendorId,
        directorId,
        transactions
      },
      updatedBy: userID
    });

    return successResponse({
      res,
      code: success ? 200 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

ledger.deleteLedgerEntry = async (req, res, next) => {
  const { userID } = res.auth;
  const { ledgerId } = req.query;

  try {
    const { success, message, data } = await LedgerModel.deleteLedgerEntry({
      userID,
      ledgerId
    });

    return successResponse({
      res,
      code: success ? 200 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

ledger.addTransaction = async (req, res, next) => {
  const { userID } = res.auth;
  const { ledgerId, transaction } = req.body;

  try {
    const { success, message, data } = await LedgerModel.addTransaction({
      userID,
      ledgerId,
      transaction
    });

    return successResponse({
      res,
      code: success ? 200 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};
ledger.addInvoiceTransaction = async (req, res, next) => {
  const { userID } = res.auth;
  const { ledgerType, customerId, transaction } = req.body;

  try {
    const { success, message, data } = await LedgerModel.addInvoiceTransaction({
      userID,
      ledgerType,
      customerId,
      transaction
    });

    return successResponse({
      res,
      code: success ? 200 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};
ledger.addVendorOrderTransaction = async (req, res, next) => {
  const { userID } = res.auth;
  const { ledgerId, transaction } = req.body;


  try {
    const { success, message, data } = await LedgerModel.addVendorOrderTransaction({
      userID,
      ledgerId,
      transaction
    });


    return successResponse({
      res,
      code: success ? 200 : 400,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = ledger; 