// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const DailyEntryModel = require('../../../models/mongodb/app/DailyEntry.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const dailyEntry = {};

dailyEntry.createEntry = async (req, res, next) => {
  const { 
    contractorId,
    customerId,
    vendorId,
    employeeId,
    directorId,
    entryDate,
    expenseCategory,
    expenseType,
    entryType,
    paymentType,
    paymentMethod,
    purpose,
    description,
    amount,
    currency,
    destinationType,
    destinationDirectorId,
    destinationVendorId,
    entryClearStatus,
    notes,
    status
  } = req.body;
  const { userID } = res.auth;

  try {
    // Generate entry number based on current date and timestamp
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = Date.now();
    const entryNumber = `ENT-${dateStr}-${timestamp}`;

    // Ensure entryDate is a proper Date object
    const formattedEntryDate = entryDate ? new Date(entryDate) : new Date();

    const { success, message, data } = await DailyEntryModel.createEntry({
      entryId: `ent-${uuid()}`,
      entryNumber,
      userID,
      contractorId: contractorId || null,
      customerId: customerId || null,
      vendorId: vendorId || null,
      employeeId: employeeId || null,
      directorId: directorId || null,
      entryDate: formattedEntryDate,
      expenseCategory: expenseCategory || null,
      expenseType: expenseType || null,
      entryType,
      paymentType: paymentType || 'debit',
      paymentMethod: paymentMethod || 'cash',
      purpose,
      description: description || '',
      amount: parseFloat(amount) || 0,
      currency: currency || 'USD',
      destinationType: destinationType || null,
      destinationDirectorId: destinationDirectorId || null,
      destinationVendorId: destinationVendorId || null,
      entryClearStatus: entryClearStatus || 'pending',
      notes: notes || '',
      status: status || 'draft',
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

dailyEntry.getAllEntries = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    contractorId,
    customerId,
    vendorId,
    employeeId,
    directorId,
    entryType,
    paymentType,
    destinationType,
    entryClearStatus,
    status,
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await DailyEntryModel.getAllEntries({
      userID,
      contractorId,
      customerId,
      vendorId,
      employeeId,
      directorId,
      entryType,
      paymentType,
      destinationType,
      entryClearStatus,
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

dailyEntry.getEntryById = async (req, res, next) => {
  const { userID } = res.auth;
  const { entryId } = req.query;

  try {
    const { success, message, data } = await DailyEntryModel.getEntryById({
      userID,
      entryId
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

dailyEntry.updateEntry = async (req, res, next) => {
  const { 
    entryId,
    contractorId,
    customerId,
    vendorId,
    employeeId,
    directorId,
    entryDate,
    expenseCategory,
    expenseType,
    entryType,
    paymentType,
    purpose,
    description,
    amount,
    currency,
    destinationType,
    destinationDirectorId,
    destinationVendorId,
    entryClearStatus,
    notes,
    status
  } = req.body;
  const { userID } = res.auth;

  try {
    const updateData = {
      contractorId: contractorId || null,
      customerId: customerId || null,
      vendorId: vendorId || null,
      employeeId: employeeId || null,
      directorId: directorId || null,
      entryDate: entryDate ? new Date(entryDate) : null,
      expenseCategory: expenseCategory || null,
      expenseType: expenseType || null,
      entryType: entryType || null,
      paymentType: paymentType || null,
      purpose: purpose || null,
      description: description || null,
      amount: amount ? parseFloat(amount) : null,
      currency: currency || null,
      destinationType: destinationType || null,
      destinationDirectorId: destinationDirectorId || null,
      destinationVendorId: destinationVendorId || null,
      entryClearStatus: entryClearStatus || null,
      notes: notes || null,
      status: status || null,
      updatedBy: userID
    };

    // Remove null values to prevent overwriting with null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null) {
        delete updateData[key];
      }
    });

    const { success, message, data } = await DailyEntryModel.updateEntry({
      userID,
      entryId,
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

dailyEntry.deleteEntry = async (req, res, next) => {
  const { userID } = res.auth;
  const { entryId } = req.query;

  try {
    const { success, message } = await DailyEntryModel.deleteEntry({
      userID,
      entryId
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
dailyEntry.saveTodayEntries = async (req, res, next) => {
  const { userID } = res.auth;

  try {
    const { success, message } = await DailyEntryModel.saveTodayEntries({
      userID,
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
dailyEntry.getEntriesByDateOrBetweenDates = async (req, res, next) => {
  const { userID } = res.auth;
  const {
    startDate,
    endDate,
    singleDate,
    contractorId,
    customerId,
    vendorId,
    employeeId,
    directorId,
    entryType,
    paymentType,
    destinationType,
    entryClearStatus,
    status,
  } = req.query;

  try {
    const { success, message, data } = await DailyEntryModel.getEntriesByDateOrBetweenDates({
      userID,
      startDate,
      endDate,
      singleDate,
      contractorId,
      customerId,
      vendorId,
      employeeId,
      directorId,
      entryType,
      paymentType,
      destinationType,
      entryClearStatus,
      status,
    });

    if (success) {
      return successResponse({
        res,
        code: 200,
        message: message,
        data: data,
      });
    } else {
      return successResponse({
        res,
        code: 400,
        message: message,
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = dailyEntry; 