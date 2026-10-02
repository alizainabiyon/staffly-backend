const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.ledger = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.createLedgerEntry,
  ].join('')]: {
    [POST]: Joi.object({
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').required(),
      customerId: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      directorId: Joi.string().optional(),
      transactions: Joi.array().items(Joi.object({
        transactionId: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        currency: Joi.string().max(3).default('PKR'),
        transactionDate: Joi.date().default(Date.now),
        paymentType: Joi.string().valid('credit', 'debit').default('debit'),
        paymentMethod: Joi.string().valid('cash', 'bank').default('cash'),
        senderType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        receiverType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        customerId: Joi.string().optional(),
        vendorId: Joi.string().optional(),
        directorId: Joi.string().optional(),
        purpose: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required()
      })).min(1).required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.getAllLedgerEntries,
  ].join('')]: {
    [GET]: Joi.object({
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').optional(),
      customerId: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      directorId: Joi.string().optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.getLedgerEntryById,
  ].join('')]: {
    [GET]: Joi.object({
      ledgerId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.updateLedgerEntry,
  ].join('')]: {
    [PUT]: Joi.object({
      ledgerId: Joi.string().required(),
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').optional(),
      customerId: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      directorId: Joi.string().optional(),
      transactions: Joi.array().items(Joi.object({
        transactionId: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        currency: Joi.string().max(3).default('PKR'),
        transactionDate: Joi.date().default(Date.now),
        paymentType: Joi.string().valid('credit', 'debit').default('debit'),
        paymentMethod: Joi.string().valid('cash', 'bank').default('cash'),
        senderType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        receiverType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        customerId: Joi.string().optional(),
        vendorId: Joi.string().optional(),
        directorId: Joi.string().optional(),
        purpose: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required(),
        status: Joi.string().valid('pending', 'completed', 'cancelled').default('pending')
      })).min(1).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.deleteLedgerEntry,
  ].join('')]: {
    [DELETE]: Joi.object({
      ledgerId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.addTransaction,
  ].join('')]: {
    [POST]: Joi.object({
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').optional(),
      customerId: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      directorId: Joi.string().optional(),
      transaction: Joi.object({
        amount: Joi.number().min(0).required(),
        currency: Joi.string().max(3).default('PKR'),
        transactionDate: Joi.date().default(Date.now),
        paymentType: Joi.string().valid('credit', 'debit').default('debit'),
        paymentMethod: Joi.string().valid('cash', 'bank').default('cash'),
        senderType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        receiverType: Joi.string().valid('customer', 'vendor', 'director', 'till').default('till'),
        customerId: Joi.string().optional(),
        vendorId: Joi.string().optional(),
        directorId: Joi.string().optional(),
        purpose: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required(),
      }).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.addInvoiceTransaction,
  ].join('')]: {
    [POST]: Joi.object({
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').optional(),
      customerId: Joi.string().optional(),
      transaction: Joi.object({
        amount: Joi.number().min(0).required(),
        transactionDate: Joi.date().default(Date.now),
        purpose: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required(),
      }).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.ledger.path,
    v1.routes.ledger.subPaths.addVendorOrderTransaction,
  ].join('')]: {
    [POST]: Joi.object({
      ledgerType: Joi.string().valid('customer', 'vendor', 'director', 'till').optional(),
      vendorId: Joi.string().optional(),
      transaction: Joi.object({
        amount: Joi.number().min(0).required(),
        transactionDate: Joi.date().default(Date.now),
        purpose: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(2).max(500).required(),
      }).optional(),
    }),
  },
}; 