// @Dependencies
const { v4: uuid } = require('uuid');
const { random } = require('lodash');

// @Models
const VendorOrderModel = require('../../../models/mongodb/app/VendorOrder.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const vendorOrder = {};

vendorOrder.createVendorOrder = async (req, res, next) => {
  const { 
    vendorId,
    invoiceId,
    description,
    items,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    previousRemainingAmount,
    terms
  } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorOrderModel.createVendorOrder({
      orderId: `vo-${uuid()}`,
      orderNumber: `VO-${random(100000, 999999)}`,
      userID,
      vendorId,
      invoiceId,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      previousRemainingAmount: parseFloat(previousRemainingAmount) || 0,
      terms,
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

vendorOrder.getAllVendorOrders = async (req, res, next) => {
  const { userID } = res.auth;
  const {} = req.query;

  try {
    const { success, message, data } = await VendorOrderModel.getAllVendorOrders({
      userID
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

vendorOrder.getVendorOrderById = async (req, res, next) => {
  const { orderId } = req.query;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorOrderModel.getVendorOrderById({
      orderId,
      userID
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

vendorOrder.getVendorOrdersByVendor = async (req, res, next) => {
  const { vendorId } = req.query;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorOrderModel.getVendorOrdersByVendor({
      vendorId,
      userID
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

vendorOrder.updateVendorOrder = async (req, res, next) => {
  const { orderId, vendorId, invoiceId, description, items, subtotal, taxAmount, discountAmount, totalAmount, previousRemainingAmount, terms } = req.body;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorOrderModel.updateVendorOrder({
      orderId,
      userID,
      vendorId,
      invoiceId,
      description,
      items,
      subtotal: parseFloat(subtotal) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      previousRemainingAmount: parseFloat(previousRemainingAmount) || 0,
      terms,
      updatedBy: userID
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


vendorOrder.deleteVendorOrder = async (req, res, next) => {
  const { orderId } = req.query;
  const { userID } = res.auth;

  try {
    const { success, message, data } = await VendorOrderModel.deleteVendorOrder({
      orderId,
      userID
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

vendorOrder.getVendorOrderStats = async (req, res, next) => {
  const { userID } = res.auth;
  const { 
    vendorId,
    startDate,
    endDate
  } = req.query;

  try {
    const { success, message, data } = await VendorOrderModel.getVendorOrderStats({
      userID,
      vendorId,
      startDate,
      endDate
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
vendorOrder.approveVendorOrder = async (req, res, next) => {
  const { userID } = res.auth;
  const { orderId } = req.body;

  try {
    const { success, message, data } = await VendorOrderModel.approveVendorOrder({
      userID,
      orderId,
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

module.exports = vendorOrder;
