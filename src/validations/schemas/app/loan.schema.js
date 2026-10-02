const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.loan = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.createLoan,
  ].join('')]: {
    [POST]: Joi.object({
      employeeId: Joi.string().required(),
      loanType: Joi.string().valid('personal', 'home', 'vehicle', 'education', 'medical', 'other').required(),
      loanAmount: Joi.number().min(0).required(),
      interestRate: Joi.number().min(0).max(100).required(),
      totalInstallments: Joi.number().min(1).max(120).required(), // Max 10 years
      startDate: Joi.date().required(),
      purpose: Joi.string().min(10).max(500).required(),
      guarantor: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        relationship: Joi.string().required(),
      }).required(),
      documents: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          file: Joi.string().required(),
        })
      ).optional(),
      remarks: Joi.string().allow('', null).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.getAllLoans,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().optional(),
      loanType: Joi.string().valid('personal', 'home', 'vehicle', 'education', 'medical', 'other').optional(),
      status: Joi.string().valid('pending', 'approved', 'active', 'completed', 'cancelled', 'defaulted').optional(),
      dateFrom: Joi.date().optional(),
      dateTo: Joi.date().optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'startDate', 'endDate', 'loanAmount', 'remainingAmount').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.getLoanById,
  ].join('')]: {
    [GET]: Joi.object({
      loanId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.getEmployeeLoans,
  ].join('')]: {
    [GET]: Joi.object({
      employeeId: Joi.string().required(),
      status: Joi.string().valid('pending', 'approved', 'active', 'completed', 'cancelled', 'defaulted').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'startDate', 'endDate', 'loanAmount', 'remainingAmount').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.updateLoanStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      loanId: Joi.string().required(),
      status: Joi.string().valid('pending', 'approved', 'active', 'completed', 'cancelled', 'defaulted').required(),
      approvedBy: Joi.string().optional(),
      remarks: Joi.string().allow('', null).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.payInstallment,
  ].join('')]: {
    [PUT]: Joi.object({
      loanId: Joi.string().required(),
      installmentNumber: Joi.number().min(1).required(),
      paidAmount: Joi.number().min(0).required(),
      remarks: Joi.string().allow('', null).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.updateLoan,
  ].join('')]: {
    [PUT]: Joi.object({
      loanId: Joi.string().required(),
      loanType: Joi.string().valid('personal', 'home', 'vehicle', 'education', 'medical', 'other').optional(),
      purpose: Joi.string().min(10).max(500).optional(),
      guarantor: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        relationship: Joi.string().required(),
      }).optional(),
      documents: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          file: Joi.string().required(),
        })
      ).optional(),
      remarks: Joi.string().allow('', null).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.loan.path,
    v1.routes.loan.subPaths.deleteLoan,
  ].join('')]: {
    [DELETE]: Joi.object({
      loanId: Joi.string().required(),
    }),
  },
}; 