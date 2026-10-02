const {
  VendorOrder: VendorOrderSchema,
} = require('../../../schemas/mongoDB/App/vendorOrder.schema');
const LedgerModel = require('./Ledger.model');
const _ = require('lodash');

// @Helper Functions
const {
  returnSuccess,
  returnError,
} = require('../../../utils/helperFunctions');

class VendorOrder extends VendorOrderSchema {

  static async createVendorOrder(params) {
    let{
      items,
      taxAmount,
      discountAmount,
      userID,
      vendorId,
      orderNumber,
      description,
    } = params;
    try {
      
      items = items.map(item => {
        item.total = (item.size * item.unitPrice)
        return item
       })
       let subtotal = _.sumBy(items, 'total')
       let totalAmount = (subtotal + taxAmount) - discountAmount

      //  get previouse remaining amount
      const {data: vendorLedger} = await LedgerModel.getLedgerEntry({
        userID: userID,
        ledgerType: 'vendor',
        vendorId: vendorId,
      });
      let previousRemainingAmount = vendorLedger.calculation.closingBalance || 0;
      const result = await VendorOrder.create({
        ...params,
        subtotal,
        totalAmount,
        previousRemainingAmount,
      });

      await LedgerModel.addVendorOrderTransaction({
        userID: userID,
        ledgerType: 'vendor',
        vendorId: vendorId,
        transaction: {
          amount: totalAmount,
          description: `Vendor order ${orderNumber}`,
          notes: `Ledger entry created for vendor order ${orderNumber}`,
        }
      });

      
      return returnSuccess({
        success: true,
        message: 'Vendor order created successfully',
        data: result,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating vendor order',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllVendorOrders(params) {
    try {
      const {
        userID,
      } = params;

      const query = { userID };

      const total = await VendorOrderSchema.find(query).lean().populate({
        path: 'vendorId',
        select: 'name companyName email phone address',
        localField: 'vendorId',
        foreignField: 'vendorId'
      }).populate({
        path: 'invoiceId',
        select: 'invoiceNumber',
        localField: 'invoiceId',
        foreignField: 'invoiceId'
      });

      return returnSuccess({
        success: true,
        message: 'Vendor orders retrieved successfully',
        data: total,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendor orders',
        error: error.message,
        code: 500
      });
    }
  }

  static async getVendorOrderById(params) {
    try {
      const { orderId, userID } = params;

      const vendorOrder = await VendorOrderSchema.findOne({ 
        orderId, 
        userID 
      }).lean().populate({
        path: 'vendorId',
        select: 'name companyName email phone address',
        localField: 'vendorId',
        foreignField: 'vendorId'
      }).populate({
        path: 'invoiceId',
        localField: 'invoiceId',
        foreignField: 'invoiceId'
      })

      if (!vendorOrder) {
        return returnError({
          success: false,
          message: 'Vendor order not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Vendor order retrieved successfully',
        data: {
          vendorOrder,
        },
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendor order',
        error: error.message,
        code: 500
      });
    }
  }

  static async getVendorOrdersByVendor(params) {
    try {
      const {
        vendorId,
        userID,
      } = params;

      const query = { userID, vendorId };

      const vendorOrders = await VendorOrderSchema.find(query).lean();
      if(!vendorOrders){
        return returnError({
          success: false,
          message: 'Vendor orders not found',
          code: 404
        });
      }
      

      return returnSuccess({
        success: true,
        message: 'Vendor orders retrieved successfully',
        data: vendorOrders
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendor orders',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateVendorOrder(params) {
    let{
      orderId,
      items,
      taxAmount,
      discountAmount,
      userID,
      vendorId,
    } = params;
    try {
      
      items = items.map(item => {
        item.total = (item.size * item.unitPrice)
        return item
       })
       let subtotal = _.sumBy(items, 'total')
       let totalAmount = (subtotal + taxAmount) - discountAmount

      //  get previouse remaining amount
      const {data: vendorLedger} = await LedgerModel.getLedgerEntry({
        userID: userID,
        ledgerType: 'vendor',
        vendorId: vendorId,
      });
      let previousRemainingAmount = vendorLedger.calculation.closingBalance || 0;
      const result = await VendorOrder.updateOne({
        orderId,
        userID,
      }, {
        ...params,
        subtotal,
        totalAmount,
        previousRemainingAmount,
      });

      return returnSuccess({
        success: true,
        message: 'Vendor order updated successfully',
        data: result,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating vendor order',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteVendorOrder(params) {
    try {
      const { orderId, userID } = params;

      const vendorOrder = await VendorOrderSchema.findOneAndDelete({ 
        orderId, 
        userID 
      });

      if (!vendorOrder) {
        return returnError({
          success: false,
          message: 'Vendor order not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Vendor order deleted successfully',
        data: vendorOrder,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting vendor order',
        error: error.message,
        code: 500
      });
    }
  }

  static async getVendorOrderStats(params) {
    try {
      const { userID, vendorId, startDate, endDate } = params;

      const query = { userID };
      if (vendorId) query.vendorId = vendorId;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const totalOrders = await VendorOrderSchema.countDocuments(query);
      const totalAmount = await VendorOrderSchema.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const stats = {
        totalOrders,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        averageOrderValue: totalOrders > 0 ? (totalAmount.length > 0 ? totalAmount[0].total / totalOrders : 0) : 0
      };

      return returnSuccess({
        success: true,
        message: 'Vendor order stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendor order stats',
        error: error.message,
        code: 500
      });
    }
  }

  static async approveVendorOrder(params) {
    try {
      const { userID, orderId } = params;

      // Find the vendor order
      const vendorOrder = await VendorOrderSchema.findOne({
        orderId: orderId,
        userID: userID
      });

      if (!vendorOrder) {
        return returnError({
          success: false,
          message: 'Vendor order not found',
          code: 404
        });
      }

      // Check if order is already approved
      if (vendorOrder.status === 'approved') {
        return returnError({
          success: false,
          message: 'Vendor order is already approved',
          code: 400
        });
      }

      // Check if order can be approved (should be in pending status)
      if (vendorOrder.status !== 'pending') {
        return returnError({
          success: false,
          message: `Vendor order cannot be approved. Current status: ${vendorOrder.status}`,
          code: 400
        });
      }

      // Update the order status to approved
      const updatedOrder = await VendorOrderSchema.findOneAndUpdate(
        { orderId: orderId, userID: userID },
        { 
          status: 'approved'
        },
        { new: true }
      ).populate({
        path: 'vendorId',
        select: 'name companyName email phone address',
        localField: 'vendorId',
        foreignField: 'vendorId'
      });

      // Create ledger entry for approved order
      await LedgerModel.addVendorOrderTransaction({
        userID: userID,
        ledgerType: 'vendor',
        vendorId: vendorOrder.vendorId,
        transaction: {
          amount: vendorOrder.totalAmount,
          description: `Approved vendor order ${vendorOrder.orderNumber}`,
          notes: `Order approved on ${new Date().toISOString()}`,
          type: 'approval'
        }
      });

      return returnSuccess({
        success: true,
        message: 'Vendor order approved successfully',
        data: updatedOrder
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error approving vendor order',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = VendorOrder;
