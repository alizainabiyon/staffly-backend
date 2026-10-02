const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.quotation = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.createQuotation,
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
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.getAllQuotations,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
      customerId: Joi.string().optional(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'quotationNumber', 'subject', 'status', 'totalAmount').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.getQuotationById,
  ].join('')]: {
    [GET]: Joi.object({
      quotationId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.getQuotationsByCustomer,
  ].join('')]: {
    [GET]: Joi.object({
      customerId: Joi.string().required(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'quotationNumber', 'subject', 'status', 'totalAmount').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.updateQuotation,
  ].join('')]: {
    [PUT]: Joi.object({
      quotationId: Joi.string().required(),
      contractorId: Joi.string().allow(null, '').optional(),
      customerId: Joi.string().required(),
      quotationNumber: Joi.string().optional(),
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
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.updateQuotationStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      quotationId: Joi.string().required(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.deleteQuotation,
  ].join('')]: {
    [DELETE]: Joi.object({
      quotationId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.searchQuotations,
  ].join('')]: {
    [GET]: Joi.object({
      searchTerm: Joi.string().optional(),
      contractorId: Joi.string().optional(),
      status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'quotationNumber', 'subject', 'status', 'totalAmount').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.getQuotationStats,
  ].join('')]: {
    [GET]: Joi.object({
      contractorId: Joi.string().optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.quotation.path,
    v1.routes.quotation.subPaths.convertToInvoice,
  ].join('')]: {
    [POST]: Joi.object({
      quotationId: Joi.string().required(),
    }),
  },
}; 