const {
  Vendor: VendorSchema,
} = require('../../../schemas/mongoDB/App/vendor.schema');

const LedgerModel = require('../../../models/mongodb/app/Ledger.model');
const VendorOrderModel = require('../../../models/mongodb/app/VendorOrder.model');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Vendor extends VendorSchema {

  static async createVendor(params) {
    try {

      const result = await Vendor.create(params);
      if(result) {
        await LedgerModel.createLedgerEntry({
          userID: params.userID,
          ledgerType: 'vendor',
          vendorId: result.vendorId,
          createdBy: params.createdBy,
        });
      }

      return returnSuccess({
        success: true,
        message: 'Vendor created successfully',
        data: result,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating vendor',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllVendors(params) {
    try {
      const {
        userID,
        name,
        email,
        type,
        category,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      const query = { userID };

      if (name) query.name = { $regex: name, $options: 'i' };
      if (email) query.email = { $regex: email, $options: 'i' };
      if (type) query.type = type;
      if (category) query.category = category;
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const vendors = await VendorSchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await VendorSchema.countDocuments(query);

      return returnSuccess({
        success: true,
        message: 'Vendors retrieved successfully',
        data: {
          vendors,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendors',
        error: error.message,
        code: 500
      });
    }
  }

  static async getVendorById(params) {
    try {
      const { userID, vendorId } = params;

      const vendor = await VendorSchema.findOne({
        vendorId: vendorId,
        userID: userID
      }).lean();

      if (!vendor) {
        return returnError({
          success: false,
          message: 'Vendor not found',
          code: 404
        });
      }
      let {error, success, data: ledger} = await LedgerModel.getLedgerEntry({
        userID: userID,
        ledgerType: 'vendor',
        vendorId: vendorId,
      });

      let {data: vendorOrders} = await VendorOrderModel.getVendorOrdersByVendor({
        userID: userID,
        vendorId: vendorId,
      });

      return returnSuccess({
        success: true,
        message: 'Vendor retrieved successfully',
        data: {
          vendor: vendor,
          ledger: ledger,
          vendorOrders: vendorOrders,
        },
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving vendor',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateVendor(params) {
    try {
      const {
        userID,
        vendorId,
        updateData
      } = params;

      const updatedVendor = await VendorSchema.findOneAndUpdate(
        { vendorId: vendorId, userID: userID },
        updateData,
        { new: true }
      );

      return returnSuccess({
        success: true,
        message: 'Vendor updated successfully',
        data: updatedVendor
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating vendor',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteVendor(params) {
    try {
      const { userID, vendorId } = params;

      const vendor = await VendorSchema.findOne({
        vendorId: vendorId,
        userID: userID
      });

      if (!vendor) {
        return returnError({
          success: false,
          message: 'Vendor not found',
          code: 404
        });
      }

      await VendorSchema.findOneAndDelete({
        vendorId: vendorId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Vendor deleted successfully'
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting vendor',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = Vendor; 