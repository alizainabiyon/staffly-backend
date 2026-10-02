const {
  Customer: CustomerSchema,
} = require('../../../schemas/mongoDB/App/customer.schema');

const LedgerModel = require('../../../models/mongodb/app/Ledger.model');
const InvoiceModel = require('../../../models/mongodb/app/Invoice.model');
const QuotationModel = require('../../../models/mongodb/app/Quotation.model');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Customer extends CustomerSchema {

  static async createCustomer(params) {
    try {
      const customer = await CustomerSchema.create(params);
      await LedgerModel.createLedgerEntry({
        userID: params.userID,
        ledgerType: 'customer',
        customerId: customer.customerId,
        createdBy: params.createdBy,
      });
      return returnSuccess({
        success: true,
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error) {
      return returnError(errorDB('Failed to create customer'));
    }
  }

  static async getAllCustomers(userID) {
    try {
      const customers = await CustomerSchema.find({ userID: userID })

      return returnSuccess({
        success: true,
        message: 'Customers retrieved successfully',
        data: customers,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve customers'));
    }
  }

  static async getCustomerById(params) {
    try {
      const { userID, customerId } = params;

      const customer = await CustomerSchema.findOne({ 
        customerId: customerId,
        userID: userID 
      }).lean();

      if (!customer) {
        return returnError({
          success: false,
          message: 'Customer not found',
          code: 404
        });
      }

      // Fetch related data
      let ledger = null;
      let invoices = null;
      let quotations = null;

      try {
        // Fetch ledger entries for this customer
        const ledgerResult = await LedgerModel.getLedgerEntry({
          userID: userID,
          ledgerType: 'customer',
          customerId: customerId,
        });
        ledger = ledgerResult?.data || null;
      } catch (ledgerError) {
        console.log('Error fetching ledger:', ledgerError.message);
        ledger = null;
      }

      try {
        // Fetch invoices for this customer
        const invoicesResult = await InvoiceModel.getInvoicesByCustomer({
          userID: userID,
          customerId: customerId,
        });
        invoices = invoicesResult?.data || null;
      } catch (invoicesError) {
        console.log('Error fetching invoices:', invoicesError.message);
        invoices = null;
      }

      try {
        // Fetch quotations for this customer
        const quotationsResult = await QuotationModel.getQuotationsByCustomer({
          userID: userID,
          customerId: customerId,
        });
        quotations = quotationsResult?.data || null;
      } catch (quotationsError) {
        console.log('Error fetching quotations:', quotationsError.message);
        quotations = null;
      }

      return returnSuccess({
        success: true,
        message: 'Customer details retrieved successfully',
        data: {
          customer: customer,
          ledger: ledger,
          invoices: invoices,
          quotations: quotations,
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve customer details'));
    }
  }

  static async getCustomersByContractor(params) {
    try {
      const {
        userID,
        contractorId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { 
        userID,
        contractorId: contractorId
      };

      // Status filter
      if (status) {
        query.status = status;
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const customers = await CustomerSchema.find(query)
        .populate('contractorId', 'name companyName category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await CustomerSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Contractor customers retrieved successfully',
        data: {
          customers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve contractor customers'));
    }
  }

  static async updateCustomer(params) {
    try {
      const { userID, customerId, updateCustomerDto } = params;

      // Add updatedBy field
      updateCustomerDto.updatedBy = userID;

      const customer = await CustomerSchema.findOneAndUpdate(
        { customerId: customerId, userID: userID },
        updateCustomerDto,
        { new: true }
      )

      if (!customer) {
        return returnError({
          success: false,
          message: 'Customer not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Customer updated successfully',
        data: customer,
      });
    } catch (error) {
      return returnError(errorDB('Failed to update customer'));
    }
  }

  static async updateCustomerStatus(params) {
    try {
      const { userID, customerId, status, updatedBy } = params;

      const customer = await CustomerSchema.findOneAndUpdate(
        { customerId: customerId, userID: userID },
        { 
          status: status,
          updatedBy: updatedBy
        },
        { new: true }
      ).populate('contractorId', 'name companyName category');

      if (!customer) {
        return returnError({
          success: false,
          message: 'Customer not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Customer status updated successfully',
        data: customer,
      });
    } catch (error) {
      return returnError(errorDB('Failed to update customer status'));
    }
  }

  static async deleteCustomer(params) {
    try {
      const { userID, customerId } = params;

      const customer = await CustomerSchema.findOneAndDelete({ 
        customerId: customerId,
        userID: userID 
      });

      if (!customer) {
        return returnError({
          success: false,
          message: 'Customer not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Customer deleted successfully',
        data: null,
      });
    } catch (error) {
      return returnError(errorDB('Failed to delete customer'));
    }
  }

  static async searchCustomers(params) {
    try {
      const {
        userID,
        searchTerm,
        contractorId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { userID };

      // Contractor filter
      if (contractorId) {
        query.contractorId = contractorId;
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Search term filter (case-insensitive search across multiple fields)
      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { company: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } },
          { contactPerson: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ];
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const customers = await CustomerSchema.find(query)
        .populate('contractorId', 'name companyName category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await CustomerSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Customer search completed successfully',
        data: {
          customers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to search customers'));
    }
  }

  static async getCustomerStats(params) {
    try {
      const { userID, contractorId } = params;

      // Build query object
      const query = { userID };
      if (contractorId) {
        query.contractorId = contractorId;
      }

      // Get total customers
      const totalCustomers = await CustomerSchema.countDocuments(query);

      // Get customers by status
      const statusStats = await CustomerSchema.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Get customers by customer type
      const customerTypeStats = await CustomerSchema.aggregate([
        { $match: query },
        { $group: { _id: '$customerType', count: { $sum: 1 } } }
      ]);

      // Get recent customers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentCustomers = await CustomerSchema.countDocuments({
        ...query,
        createdAt: { $gte: thirtyDaysAgo }
      });

      return returnSuccess({
        success: true,
        message: 'Customer statistics retrieved successfully',
        data: {
          totalCustomers,
          recentCustomers,
          statusStats,
          customerTypeStats
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve customer statistics'));
    }
  }
}

module.exports = Customer; 