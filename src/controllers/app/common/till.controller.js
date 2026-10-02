// @Dependencies
const { v4: uuid } = require('uuid');
// @Models
const LedgerModel = require('../../../models/mongodb/app/Ledger.model');

// @Helper Functions
const { successResponse, errorResponse } = require('../../../utils/helperFunctions');

// @Constants
const {
  errorCode: { ALREADY_EXIST, DATA_NOT_FOUND },
} = require('../../../constants');
const { lineTo } = require('pdf-lib');

// Till controller
const till = {};

till.initializeTill = async (req, res, next) => {
  const { totalAmount, cashAmount, bankAmount } = req.body;
  const { userID } = res.auth;

  try {
    // Check if till already exists for this user
    const existingTill = await LedgerModel.findOne({ userID, ledgerType: 'till' });

    
    if (existingTill) {
     return errorResponse(ALREADY_EXIST);
    }
    await LedgerModel.createLedgerEntry({
      userID: userID,
      ledgerType: 'till',
      createdBy: userID
    });


    return successResponse({
      res,
      code: 201,
      message: 'Till initialized successfully.',
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

till.getTill = async (req, res, next) => {
  let { ledgerType, directorId } = req.query;
  const { userID } = res.auth;

  try {
    const query = { userID }
    if(ledgerType === 'till') query.ledgerType = 'till';
    if(ledgerType === 'director') query.ledgerType = 'director';
    if(directorId) query.directorId = directorId;
    if(ledgerType === 'all') query.ledgerType = ['till', 'director'];

    const till = await LedgerModel.find(query);
    if (!till) {
      return errorResponse(DATA_NOT_FOUND);
    }
    let allTransactions = [];
    let totalBalance = 0;
    let totalCash = 0;
    let totalBank = 0;
    till.forEach((till) => {
      allTransactions.push(...till.transactions);
      totalBalance += till.calculation.closingBalance;
      totalCash += till.calculation.totalCash;
      totalBank += till.calculation.totalBank;
    });


    return successResponse({
      res,
      code: 200,
      message: 'Till retrieved successfully.',
      data: {
        till,
        allTransactions,
        totalBalance,
        totalCash,
        totalBank,
      },
    });
  } catch (e) {
    next(e);
  }
};

till.updateTill = async (req, res, next) => {
  const { userID } = res.auth;
  const { totalAmount, cashAmount, bankAmount, currency, notes, status } = req.body;

  try {
    const updateData = {};
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
    if (cashAmount !== undefined) updateData.cashAmount = cashAmount;
    if (bankAmount !== undefined) updateData.bankAmount = bankAmount;
    if (currency !== undefined) updateData.currency = currency;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    const updatedTill = await LedgerModel.findOneAndUpdate(
      { userID },
      updateData,
      { new: true }
    );

    if (!updatedTill) {
      return errorResponse(DATA_NOT_FOUND);
    }

    return successResponse({
      res,
      code: 200,
      message: 'Till updated successfully.',
      data: updatedTill,
    });
  } catch (e) {
    next(e);
  }
};

till.deleteTill = async (req, res, next) => {
  const { userID } = res.auth;

  try {
    const deletedTill = await LedgerModel.findOneAndDelete({ userID });

    if (!deletedTill) {
      return errorResponse(DATA_NOT_FOUND);
    }

    return successResponse({
      res,
      code: 200,
      message: 'Till deleted successfully.',
      data: deletedTill,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = till;
