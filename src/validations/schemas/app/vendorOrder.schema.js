const Joi = require('joi');
const { routesConfig } = require('../../../lib/configs');
const { baseURL, app, methods } = routesConfig;
const { v1 } = app.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.vendorOrder = {
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.createVendorOrder,
  ].join('')]: {
    [POST]: Joi.object({
      vendorId: Joi.string().required(),
      invoiceId: Joi.string().optional(),
      description: Joi.string().max(1000).optional(),
      items: Joi.array().items(
        Joi.object({
          description: Joi.string().trim().max(500).optional(),
          width: Joi.number().min(0).required(),
          height: Joi.number().min(0).required(),
          size: Joi.number().min(0).required(),
          quantity: Joi.number().min(0).required(),
          unitPrice: Joi.number().min(0).required(),
          total: Joi.number().min(0).required(),
        })
      ).required(),
      subtotal: Joi.number().min(0).required(),
      taxAmount: Joi.number().min(0).optional(),
      discountAmount: Joi.number().min(0).optional(),
      totalAmount: Joi.number().min(0).required(),
      terms: Joi.string().max(1000).optional(),
      notes: Joi.string().max(1000).optional(),
      attachments: Joi.array().items(
        Joi.object({
          name: Joi.string().optional(),
          file: Joi.string().optional(),
          type: Joi.string().optional(),
        })
      ).optional(),
      status: Joi.string().valid('pending', 'approved', 'rejected', 'completed', 'cancelled').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.getAllVendorOrders,
  ].join('')]: {
    [GET]: Joi.object({
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.getVendorOrderById,
  ].join('')]: {
    [GET]: Joi.object({
      orderId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.getVendorOrdersByVendor,
  ].join('')]: {
    [GET]: Joi.object({
      vendorId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.updateVendorOrder,
  ].join('')]: {
    [PUT]: Joi.object({
      orderId: Joi.string().required(),
      orderNumber: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      invoiceId: Joi.string().optional(),
      description: Joi.string().max(1000).optional(),
      items: Joi.array().items(
        Joi.object({
          description: Joi.string().trim().max(500).optional(),
          width: Joi.number().min(0).required(),
          height: Joi.number().min(0).required(),
          size: Joi.number().min(0).required(),
          quantity: Joi.number().min(0).required(),
          unitPrice: Joi.number().min(0).required(),
          total: Joi.number().min(0).required(),
        })
      ).optional(),
      subtotal: Joi.number().min(0).optional(),
      taxAmount: Joi.number().min(0).optional(),
      discountAmount: Joi.number().min(0).optional(),
      totalAmount: Joi.number().min(0).optional(),
      previousRemainingAmount: Joi.number().min(0).optional(),
      terms: Joi.string().max(1000).optional(),
      notes: Joi.string().max(1000).allow(null, '').optional(),
      attachments: Joi.array().items(
        Joi.object({
          name: Joi.string().optional(),
          file: Joi.string().optional(),
          type: Joi.string().optional(),
        })
      ).optional(),
      status: Joi.string().valid('pending', 'approved', 'rejected', 'completed', 'cancelled').optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.updateVendorOrderStatus,
  ].join('')]: {
    [PUT]: Joi.object({
      orderId: Joi.string().required(),
      status: Joi.string().valid('pending', 'approved', 'rejected', 'completed', 'cancelled').required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.deleteVendorOrder,
  ].join('')]: {
    [DELETE]: Joi.object({
      orderId: Joi.string().required(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.searchVendorOrders,
  ].join('')]: {
    [GET]: Joi.object({
      searchTerm: Joi.string().optional(),
      vendorId: Joi.string().optional(),
      status: Joi.string().valid('pending', 'approved', 'rejected', 'completed', 'cancelled').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'orderId', 'totalAmount', 'vendorId').optional(),
      sortOrder: Joi.string().valid('asc', 'desc').optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.getVendorOrderStats,
  ].join('')]: {
    [GET]: Joi.object({
      vendorId: Joi.string().optional(),
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().optional(),
    }),
  },
  [[
    baseURL,
    app.path,
    v1.path,
    v1.routes.vendorOrder.path,
    v1.routes.vendorOrder.subPaths.approveVendorOrder,
  ].join('')]: {
    [PUT]: Joi.object({
      orderId: Joi.string().required(),
    }),
  },
};
