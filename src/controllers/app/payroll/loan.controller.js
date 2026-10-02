// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const LoanModel = require('../../../models/mongodb/app/Loan.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const loan = {};

loan.createLoan = async (req, res, next) => {
  const { 
    employeeId, 
    loanType, 
    loanAmount, 
    interestRate, 
    totalInstallments, 
    startDate, 
    purpose, 
    guarantor, 
    documents, 
    remarks 
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await LoanModel.createLoan({
      userID,
      employeeId,
      loanType,
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      totalInstallments: parseInt(totalInstallments),
      startDate,
      purpose,
      guarantor,
      documents,
      remarks
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

loan.getAllLoans = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    employeeId, 
    loanType, 
    status, 
    dateFrom, 
    dateTo, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await LoanModel.getAllLoans({
      userID,
      employeeId,
      loanType,
      status,
      dateFrom,
      dateTo,
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

loan.getLoanById = async (req, res, next) => {
  const { userID } = res.auth;
  const { loanId } = req.query;

  try {
    const { success, message, data } = await LoanModel.getLoanById({
      userID,
      loanId
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

loan.getEmployeeLoans = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    employeeId,
    status, 
    sortBy, 
    sortOrder, 
    page, 
    limit 
  } = req.query;

  try {
    const { success, message, data } = await LoanModel.getEmployeeLoans({
      userID,
      employeeId,
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

loan.updateLoanStatus = async (req, res, next) => {
  const { loanId, status, approvedBy, remarks } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await LoanModel.updateLoanStatus({
      userID,
      loanId,
      status,
      approvedBy,
      remarks
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

loan.payInstallment = async (req, res, next) => {
  const { loanId, installmentNumber, paidAmount, remarks } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await LoanModel.payInstallment({
      userID,
      loanId,
      installmentNumber: parseInt(installmentNumber),
      paidAmount: parseFloat(paidAmount),
      remarks
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

loan.updateLoan = async (req, res, next) => {
  const { 
    loanId, 
    loanType, 
    purpose, 
    guarantor, 
    documents, 
    remarks 
  } = req.body;
  const { userID } = res.auth;

  try {
    const updateData = {};
    
    if (loanType !== undefined) updateData.loanType = loanType;
    if (purpose !== undefined) updateData.purpose = purpose;
    if (guarantor !== undefined) updateData.guarantor = guarantor;
    if (documents !== undefined) updateData.documents = documents;
    if (remarks !== undefined) updateData.remarks = remarks;

    const { success, message, data } = await LoanModel.updateLoan(loanId, updateData);

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

loan.deleteLoan = async (req, res, next) => {
  const { userID } = res.auth;
  const { loanId } = req.query;

  try {
    const { success, message, data } = await LoanModel.deleteLoan({
      userID,
      loanId
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

module.exports = loan; 