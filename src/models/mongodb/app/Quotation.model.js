const _ = require('lodash');
const { v4: uuid } = require('uuid');
const {
  Quotation: QuotationSchema,
} = require('../../../schemas/mongoDB/App/quotation.schema');

const {
  Customer: CustomerSchema,
} = require('../../../schemas/mongoDB/App/customer.schema');

const {
  Contractor: ContractorSchema,
} = require('../../../schemas/mongoDB/App/contractor.schema');

const {
  Invoice: InvoiceSchema,
} = require('../../../schemas/mongoDB/App/invoice.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Quotation extends QuotationSchema {
  static async create(data) {
    const quotation = await QuotationSchema.create(data);
    if (!quotation) {
      return returnError(errorDB('Quotation not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Quotation created successfully',
      data: quotation,
    });
  }

  static async createQuotation(params) {
    try {
      let {
        quotationId,
        userID,
        contractorId,
        customerId,
        quotationNumber,
        description,
        items,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        currency,
        terms,
        notes,
        status,
        attachments,
        createdBy
      } = params;

     items = items.map(item => {
      let calculatedTotal = 0;
      
      switch (item.type) {
        case 'total_size':
          calculatedTotal = (item.totalSize * item.unitPrice) * item.quantity;
          break;
        case 'length_width':
          calculatedTotal = (item.totalSize * item.quantity) * item.unitPrice;
          // calculatedTotal = (item.length * item.width * item.unitPrice) * item.quantity;
          break;
        case 'fixed_amount':
          calculatedTotal = item.fixedAmount * item.quantity;
          break;
        case 'quantity_only':
          calculatedTotal = item.unitPrice * item.quantity;
          break;
        default:
          calculatedTotal = 0;
      }
      
      item.total = calculatedTotal;
      return item;
     })
     subtotal = _.sumBy(items, 'total')
     totalAmount = (subtotal + taxAmount) - discountAmount

     const quotationData = {
      quotationId,
      userID,
      contractorId,
      customerId,
      quotationNumber,
      description,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      currency,
      terms,
      notes,
      status,
      attachments,
      createdBy
     }
      const quotation = await QuotationSchema.create(quotationData);
      if (!quotation) {
        return returnError(errorDB('Quotation not created'));
      }
      return returnSuccess({
        success: true,
        message: 'Quotation created successfully',
        data: quotation,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating quotation',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllQuotations(params) {
    try {
      const {
        userID,
        contractorId,
        customerId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      const filter = { userID: userID };
      
      if (contractorId) filter.contractorId = contractorId;
      if (customerId) filter.customerId = customerId;
      if (status) filter.status = status;

      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const skip = (page - 1) * limit;

      const quotations = await QuotationSchema.find(filter)
        .populate({
          path: 'customerId',
          select: 'name company email phone',
          localField: 'customerId',
          foreignField: 'customerId'
        })
        .populate({
          path: 'contractorId',
          select: 'name companyName',
          localField: 'contractorId',
          foreignField: 'contractorId'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const total = await QuotationSchema.countDocuments(filter);

      return returnSuccess({
        success: true,
        message: 'Quotations retrieved successfully',
        data: {
          quotations,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving quotations',
        error: error.message,
        code: 500
      });
    }
  }

  static async getQuotationById(params) {
    try {
      const { userID, quotationId } = params;

      const quotation = await QuotationSchema.findOne({
        quotationId: quotationId,
        userID: userID
      }).populate({
          path: 'customerId',
          select: 'name company email phone address',
          localField: 'customerId',
          foreignField: 'customerId'
        })
        .populate({
          path: 'contractorId',
          select: 'name companyName',
          localField: 'contractorId',
          foreignField: 'contractorId'
        });

      if (!quotation) {
        return returnError({
          success: false,
          message: 'Quotation not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Quotation retrieved successfully',
        data: quotation
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving quotation',
        error: error.message,
        code: 500
      });
    }
  }

  static async getQuotationsByCustomer(params) {
    try {
      const {
        userID,
        customerId,
        contractorId
      } = params;

      const filter = { 
        userID: userID,
      };
      if (contractorId) filter.contractorId = contractorId;
      if (customerId) filter.customerId = customerId;

      const quotations = await QuotationSchema.find(filter)
        .populate({
          path: 'contractorId',
          select: 'name companyName',
          localField: 'contractorId',
          foreignField: 'contractorId'
        })
        .populate({
          path: 'customerId',
          select: 'name company email phone',
          localField: 'customerId',
          foreignField: 'customerId'
        })

      return returnSuccess({
        success: true,
        message: 'Customer quotations retrieved successfully',
        data: quotations,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving customer quotations',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateQuotation(params) {
    try {
      let { quotationId, userID, contractorId, customerId, quotationNumber, description, items, subtotal, taxAmount, discountAmount, totalAmount, currency, terms, notes, status, attachments, updatedBy } = params;

     items = items.map(item => {
      let calculatedTotal = 0;
      
      switch (item.type) {
        case 'total_size':
          calculatedTotal = (item.totalSize * item.unitPrice) * item.quantity;
          break;
        case 'length_width':
          calculatedTotal = (item.totalSize * item.quantity) * item.unitPrice;
          // calculatedTotal = (item.length * item.width * item.unitPrice) * item.quantity;
          break;
        case 'fixed_amount':
          calculatedTotal = item.fixedAmount * item.quantity;
          break;
        case 'quantity_only':
          calculatedTotal = item.unitPrice * item.quantity;
          break;
        default:
          calculatedTotal = 0;
      }
      
      item.total = calculatedTotal;
      return item;
     })
     subtotal = _.sumBy(items, 'total')
     totalAmount = (subtotal + taxAmount) - discountAmount

     const updateQuotationDto = {
      contractorId,
      customerId,
      quotationNumber,
      description,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      currency,
      terms,
      notes,
      status,
      attachments,
      updatedBy
     }

      const updatedQuotation = await QuotationSchema.findOneAndUpdate(
        { quotationId: quotationId, userID: userID },
        { ...updateQuotationDto },
        { new: true }
      )

      return returnSuccess({
        success: true,
        message: 'Quotation updated successfully',
        data: updatedQuotation
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating quotation',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateQuotationStatus(params) {
    try {
      const { userID, quotationId, status, updatedBy } = params;

      const quotation = await QuotationSchema.findOne({
        quotationId: quotationId,
        userID: userID
      });

      if (!quotation) {
        return returnError({
          success: false,
          message: 'Quotation not found',
          code: 404
        });
      }

      const updateData = { status, updatedBy };

      // Update timestamps based on status
      if (status === 'sent') {
        updateData.sentAt = new Date();
      } else if (status === 'accepted') {
        updateData.acceptedAt = new Date();
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
      }

      const updatedQuotation = await QuotationSchema.findOneAndUpdate(
        { quotationId: quotationId, userID: userID },
        updateData,
        { new: true }
      );

      return returnSuccess({
        success: true,
        message: 'Quotation status updated successfully',
        data: updatedQuotation
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating quotation status',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteQuotation(params) {
    try {
      const { userID, quotationId } = params;

      const quotation = await QuotationSchema.findOne({
        quotationId: quotationId,
        userID: userID
      });

      if (!quotation) {
        return returnError({
          success: false,
          message: 'Quotation not found',
          code: 404
        });
      }

      // Don't allow deletion if quotation is converted to invoice
      if (quotation.convertedToInvoice) {
        return returnError({
          success: false,
          message: 'Cannot delete quotation that has been converted to invoice',
          code: 400
        });
      }

      await QuotationSchema.findOneAndDelete({
        quotationId: quotationId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Quotation deleted successfully',
        data: null
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting quotation',
        error: error.message,
        code: 500
      });
    }
  }

  static async searchQuotations(params) {
    try {
      const {
        userID,
        searchTerm,
        contractorId,
        status,
        sortBy,
        sortOrder,
        page,
        limit
      } = params;

      const filter = { userID: userID };
      
      if (contractorId) filter.contractorId = contractorId;
      if (status) filter.status = status;

      if (searchTerm) {
        filter.$or = [
          { quotationNumber: { $regex: searchTerm, $options: 'i' } },
          { subject: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const skip = (page - 1) * limit;

      const quotations = await QuotationSchema.find(filter)
        .populate({
          path: 'customerId',
          select: 'name company email phone',
          localField: 'customerId',
          foreignField: 'customerId'
        })
        .populate({
          path: 'contractorId',
          select: 'name companyName',
          localField: 'contractorId',
          foreignField: 'contractorId'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const total = await QuotationSchema.countDocuments(filter);

      return returnSuccess({
        success: true,
        message: 'Quotations search completed successfully',
        data: {
          quotations,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error searching quotations',
        error: error.message,
        code: 500
      });
    }
  }

  static async getQuotationStats(params) {
    try {
      const { userID, contractorId } = params;

      const filter = { userID: userID };
      if (contractorId) filter.contractorId = contractorId;

      const stats = await QuotationSchema.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      const totalQuotations = await QuotationSchema.countDocuments(filter);
      const totalAmount = await QuotationSchema.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const statsObject = {
        total: totalQuotations,
        totalAmount: totalAmount[0]?.total || 0,
        byStatus: {}
      };

      stats.forEach(stat => {
        statsObject.byStatus[stat._id] = {
          count: stat.count,
          totalAmount: stat.totalAmount
        };
      });

      return returnSuccess({
        success: true,
        message: 'Quotation statistics retrieved successfully',
        data: statsObject
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving quotation statistics',
        error: error.message,
        code: 500
      });
    }
  }

  static async convertToInvoice(params) {
    try {
      const { userID, quotationId } = params;

      const quotation = await QuotationSchema.findOne({
        quotationId: quotationId,
        userID: userID
      });

      if (!quotation) {
        return returnError({
          success: false,
          message: 'Quotation not found',
          code: 404
        });
      }

      if (quotation.convertedToInvoice) {
        return returnError({
          success: false,
          message: 'Quotation has already been converted to invoice',
          code: 400
        });
      }

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // Create invoice data
      const invoiceData = {
        invoiceId: `inv-${uuid()}`,
        userID: userID,
        contractorId: quotation.contractorId,
        customerId: quotation.customerId,
        quotationId: quotation.quotationId,
        invoiceNumber: invoiceNumber,
        description: quotation.description,
        items: quotation.items,
        subtotal: quotation.subtotal,
        taxAmount: quotation.taxAmount,
        discountAmount: quotation.discountAmount,
        totalAmount: quotation.totalAmount,
        currency: quotation.currency,
        terms: quotation.terms,
        notes: quotation.notes,
        status: 'converted',
        attachments: quotation.attachments,
        createdBy: userID
      };

      // Create invoice
      const invoice = await InvoiceSchema.create(invoiceData);

      // Update quotation
      await QuotationSchema.findOneAndUpdate(
        { quotationId: quotationId, userID: userID },
        {
          convertedToInvoice: true,
          invoiceId: invoice.invoiceId,
          status: 'converted',
          updatedBy: userID
        }
      );

      return returnSuccess({
        success: true,
        message: 'Quotation converted to invoice successfully',
        data: {}
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error converting quotation to invoice',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = Quotation; 