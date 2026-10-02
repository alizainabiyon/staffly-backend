// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const SalaryModel = require('../../../models/mongodb/app/Salary.model');
const DailyEntryModel = require('../../../models/mongodb/app/DailyEntry.model');
const LedgerModel = require('../../../models/mongodb/app/Ledger.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');
const { random } = require('lodash');

const salary = {};

salary.generateSalaryOfAllEmployees = async (req, res, next) => {
  const { month, year } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await SalaryModel.generateSalaryOfAllEmployees({
      userID,
      month: parseInt(month),
      year: parseInt(year)
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

salary.getSalaryHistoryOfAllEmployees = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    month, 
    year, 
    status
  } = req.query;

  try {
    const { success, message, data } = await SalaryModel.getSalaryHistoryOfAllEmployees({
      userID,
      month,
      year,
      status,
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

salary.getSalaryHistoryOfAnEmployee = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    employeeId,
  } = req.query;

  try {
    const { success, message, data } = await SalaryModel.getSalaryHistoryOfAnEmployee({
      userID,
      employeeId
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

salary.getSalaryDetail = async (req, res, next) => {
  const { userID } = res.auth;
  const { salaryId } = req.query;

  try {
    const { success, message, data } = await SalaryModel.getSalaryDetail({
      userID,
      salaryId
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

salary.updateSalary = async (req, res, next) => {
  const { salaryId, basicSalary, overtimeAmount, deduction, grossSalary, netSalary, remarks } = req.body;
  const { userID } = res.auth;

  try {
    const updateData = {};
    
    if (basicSalary !== undefined) updateData.basicSalary = basicSalary;
    if (overtimeAmount !== undefined) updateData.overtimeAmount = overtimeAmount;
    if (deduction !== undefined) updateData.deduction = deduction;
    if (grossSalary !== undefined) updateData.grossSalary = grossSalary;
    if (netSalary !== undefined) updateData.netSalary = netSalary;
    if (remarks !== undefined) updateData.remarks = remarks;

    const { success, message, data } = await SalaryModel.update(salaryId, updateData);

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

salary.updateSalaryStatus = async (req, res, next) => {
  const { salaryId, tillFrom, directorId, paymentMethod } = req.body;
  const { userID } = res.auth;

  try {
    const paymentDate = new Date();
    const { success, message, data } = await SalaryModel.updateStatus(salaryId, 'paid', paymentDate);

    // If salary status is updated to 'paid', process loan deductions
    if (success && data.status === 'paid') {
      // await SalaryModel.processLoanDeductions(salaryId, userID);
      await DailyEntryModel.create({
        entryId: `ent-${uuid()}`,
        entryNumber: `SAL-${random(100000, 999999)}`,
        userID,
        entryDate: paymentDate,
        expenseCategory: 'office',
        expenseType: 'salary',
        entryType: 'expense',
        paymentType: 'debit',
        paymentMethod,
        purpose: 'Salary Payment',
        description: 'Salary Payment',
        amount: data.netSalary,
        destinationType: tillFrom,
        directorId: directorId || null,
        entryClearStatus: 'cleared',
        status: 'completed',
        createdBy: userID
      });
      await LedgerModel.addExpenseTransaction({
        userID,
        destinationType: tillFrom,
        amount: data.netSalary,
        paymentType: 'debit',
        paymentMethod,
        purpose: 'Salary Payment',
        description: 'Salary Payment',
        directorId: directorId || null,
        entryType: 'expense',
        expenseCategory: 'office',
        expenseType: 'salary',
      });
    }

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

salary.processLoanDeductions = async (req, res, next) => {
  const { salaryId } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await SalaryModel.processLoanDeductions(salaryId, userID);

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

module.exports = salary; 