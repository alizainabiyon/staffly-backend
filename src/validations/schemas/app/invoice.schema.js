const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.invoice = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.createInvoice,
  ].join('')]: {
    [POST]: Joi.object({
      contractorId: Joi.string().allow(null, '').optional(),
      customerId: Joi.string().required(),
      description: Joi.string().max(1000).optional(),
      items: Joi.array().items(
          Joi.object({
          description: Joi.string().required(),
          type: Joi.string().valid('total_size', 'length_width', 'fixed_amount', 'quantity_only').required(),
          length: Joi.number().min(0).optional(),
          width: Joi.number().min(0).optional(),
          quantity: Joi.number().min(0).required(),
          totalSize: Joi.number().min(0).optional(),
          unitPrice: Joi.number().min(0).optional(),
          fixedAmount: Joi.number().min(0).optional(),
          total: Joi.number().min(0).optional(),
        })
      ).required(),
      subtotal: Joi.number().min(0).required(),
      taxAmount: Joi.number().min(0).optional(),
      discountAmount: Joi.number().min(0).optional(),
      totalAmount: Joi.number().min(0).required(),
      advanceAmount: Joi.number().min(0).optional(),
      currency: Joi.string().max(3).optional(),
      terms: Joi.string().max(1000).optional(),
      notes: Joi.string().max(1000).optional(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').optional(),
      attachments: Joi.array().items(
        Joi.object({
          name: Joi.string().optional(),
          file: Joi.string().optional(),
          type: Joi.string().optional(),
        })
      ).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.getAllInvoices,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
      customerId: Joi.string().optional(),
      status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'invoiceNumber', 'subject', 'status', 'totalAmount', 'dueDate').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.getInvoiceById,
  ].join('')]: {
    [GET]: Joi.object({
      invoiceId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.getInvoicesByCustomer,
  ].join('')]: {
    [GET]: Joi.object({
      customerId: Joi.string().required(),
      status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'invoiceNumber', 'subject', 'status', 'totalAmount', 'dueDate').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.updateInvoice,
  ].join('')]: {
    [PUT]: Joi.object({
      invoiceId: Joi.string().required(),
      contractorId: Joi.string().allow(null, '').optional(),
      customerId: Joi.string().required(),
      invoiceNumber: Joi.string().required(),
      description: Joi.string().max(1000).optional(),
      items: Joi.array().items(
          Joi.object({
          description: Joi.string().required(),
          type: Joi.string().valid('total_size', 'length_width', 'fixed_amount', 'quantity_only').required(),
          length: Joi.number().min(0).optional(),
          width: Joi.number().min(0).optional(),
          quantity: Joi.number().min(0).required(),
          totalSize: Joi.number().min(0).optional(),
          unitPrice: Joi.number().min(0).optional(),
          fixedAmount: Joi.number().min(0).optional(),
          total: Joi.number().min(0).optional(),
        })
      ).required(),
      subtotal: Joi.number().min(0).required(),
      taxAmount: Joi.number().min(0).optional(),
      discountAmount: Joi.number().min(0).optional(),
      totalAmount: Joi.number().min(0).required(),
      advanceAmount: Joi.number().min(0).optional(),
      currency: Joi.string().max(3).optional(),
      terms: Joi.string().max(1000).optional(),
      notes: Joi.string().max(1000).optional(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').optional(),
      attachments: Joi.array().items(
        Joi.object({
          name: Joi.string().optional(),
          file: Joi.string().optional(),
          type: Joi.string().optional(),
        })
      ).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.updateInvoiceStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      invoiceId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.deleteInvoice,
  ].join('')]: {
    [DELETE]: Joi.object({
      invoiceId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.searchInvoices,
  ].join('')]: {
    [GET]: Joi.object({
      searchTerm: Joi.string().optional(),
      contractorId: Joi.string().optional(),
      status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'invoiceNumber', 'subject', 'status', 'totalAmount', 'dueDate').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.getInvoiceStats,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.createLedgerEntry,
  ].join('')]: {
    [POST]: Joi.object({
      invoiceId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.invoice.path,
    v1.routes.invoice.subPaths.sendInvoice,
  ].join('')]: {
    [POST]: Joi.object({
      invoiceId: Joi.string().required(),
      sendMethod: Joi.string().valid('email', 'sms', 'whatsapp', 'postal').required(),
    }),
  },
}; 