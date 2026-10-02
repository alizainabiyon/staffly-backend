const _ = require('lodash');
const {
  Invoice: InvoiceSchema,
} = require('../../../schemas/mongoDB/App/invoice.schema');

const LedgerModel = require('../../../models/mongodb/app/Ledger.model');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Invoice extends InvoiceSchema {

  static async createInvoice(params) {
    try {
      let {
        invoiceId,
        userID,
        contractorId,
        customerId,
        invoiceNumber,
        description,
        items,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        advanceAmount,
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

      //  get previouse remaining amount
      const {data: customerLedger} = await LedgerModel.getLedgerEntry({
        userID: userID,
        ledgerType: 'customer',
        customerId: customerId,
      });
      let previousRemainingAmount = customerLedger.calculation.closingBalance || 0;
  
       const invoiceData = {
        invoiceId,
        userID,
        contractorId,
        customerId,
        invoiceNumber,
        description,
        items,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        previousRemainingAmount,
        advanceAmount,
        currency,
        terms,
        notes,
        status,
        attachments,
        createdBy
       }
        const invoice = await InvoiceSchema.create(invoiceData);
        if (!invoice) {
          return returnError(errorDB('Invoice not created'));
        }
        return returnSuccess({
          success: true,
          message: 'Invoice created successfully',
          data: invoice
        });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating invoice',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllInvoices(params) {
    try {
      let {
        userID,
        contractorId,
        customerId,
        status,
        sortBy,
        sortOrder,
        page,
        limit
      } = params;

      sortBy = sortBy || 'createdAt';
      sortOrder = sortOrder || 'desc';
      page = page || 1;
      limit = limit || 10;
    

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

      const invoices = await InvoiceSchema.find(filter)
      .populate({
        path: 'customerId',
        select: 'name company email phone',
        localField: 'customerId',
        foreignField: 'customerId'
      }).sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const total = await InvoiceSchema.countDocuments(filter);

      return returnSuccess({
        success: true,
        message: 'Invoices retrieved successfully',
        data: {
          invoices,
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
        message: 'Error retrieving invoices',
        error: error.message,
        code: 500
      });
    }
  }

  static async getInvoiceById(params) {
    try {
      const { userID, invoiceId } = params;

      const invoice = await InvoiceSchema.findOne({
        invoiceId: invoiceId,
        userID: userID
      }).populate({
        path: 'customerId',
        select: 'name company email phone',
        localField: 'customerId',
        foreignField: 'customerId'
      }).populate({
        path: 'contractorId',
        select: 'name companyName',
        localField: 'contractorId',
        foreignField: 'contractorId'
      })

      if (!invoice) {
        return returnError({
          success: false,
          message: 'Invoice not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Invoice retrieved successfully',
        data: invoice
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving invoice',
        error: error.message,
        code: 500
      });
    }
  }

  static async getInvoicesByCustomer(params) {
    try {
      const {
        userID,
        customerId,
        contractorId
      } = params;

      const filter = {
        userID: userID,
      };
      if (customerId) filter.customerId = customerId;
      if (contractorId) filter.contractorId = contractorId;


      const invoices = await InvoiceSchema.find(filter)
      .populate({
        path: 'customerId',
        select: 'name company email phone',
        localField: 'customerId',
        foreignField: 'customerId'
      }).populate({
        path: 'contractorId',
        select: 'name companyName',
        localField: 'contractorId',
        foreignField: 'contractorId'
      })

      return returnSuccess({
        success: true,
        message: 'Customer invoices retrieved successfully',
        data: invoices,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving customer invoices',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateInvoice(params) {
    let { invoiceId,
      userID,
      contractorId,
      customerId,
      invoiceNumber,
      description,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      advanceAmount,
      currency,
      terms,
      notes,
      status,
      attachments,
      updatedBy} = params;
    try {

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
  
       const invoiceData = {
        contractorId,
        customerId,
        invoiceNumber,
        description,
        items,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        advanceAmount,
        currency,
        terms,
        notes,
        status,
        attachments,
        updatedBy
       }

      const updatedInvoice = await InvoiceSchema.findOneAndUpdate(
        { invoiceId: invoiceId, userID: userID },
        invoiceData,
        { new: true }
      ).populate({
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

      return returnSuccess({
        success: true,
        message: 'Invoice updated successfully',
        data: updatedInvoice
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating invoice',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateInvoiceStatus(params) {
    try {
      const { userID, invoiceId } = params;

      const invoice = await InvoiceSchema.findOne({
        invoiceId: invoiceId,
        userID: userID
      });

      if (!invoice) {
        return returnError({
          success: false,
          message: 'Invoice not found',
          code: 404
        });
      }

      const updateData = { status: 'approved' };


      const updatedInvoice = await InvoiceSchema.findOneAndUpdate(
        { invoiceId: invoiceId, userID: userID },
        updateData,
        { new: true }
      );

      // update customer ledger
      await LedgerModel.addInvoiceTransaction({
        userID: userID,
        ledgerType: 'customer',
        customerId: invoice.customerId,
        transaction: {
        amount: invoice.totalAmount,
          description: `Invoice ${invoice.invoiceNumber} - ${invoice.description}`,
          notes: `Ledger entry created for invoice ${invoice.invoiceNumber}`,
        }
      });
      // if(updatedInvoice.advanceAmount > 0){
      //   await LedgerModel.addInvoiceTransaction({
      //     userID: userID,
      //     ledgerType: 'customer',
      //     customerId: invoice.customerId,
      //     transaction: {
      //       amount: invoice.advanceAmount,
      //       description: `Advance payment for invoice ${invoice.invoiceNumber}`,
      //       notes: `Ledger entry created for advance payment for invoice ${invoice.invoiceNumber}`,
      //     }
      //   });
      // }

      return returnSuccess({
        success: true,
        message: 'Invoice approved successfully',
        data: updatedInvoice
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error approving invoice',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteInvoice(params) {
    try {
      const { userID, invoiceId } = params;

      const invoice = await InvoiceSchema.findOne({
        invoiceId: invoiceId,
        userID: userID
      });

      if (!invoice) {
        return returnError({
          success: false,
          message: 'Invoice not found',
          code: 404
        });
      }

      // Don't allow deletion if invoice is paid or ledger is created
      if (invoice.status === 'paid' || invoice.ledgerCreated) {
        return returnError({
          success: false,
          message: 'Cannot delete invoice that is paid or has ledger entries',
          code: 400
        });
      }

      await InvoiceSchema.findOneAndDelete({
        invoiceId: invoiceId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Invoice deleted successfully',
        data: null
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting invoice',
        error: error.message,
        code: 500
      });
    }
  }

  static async searchInvoices(params) {
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
          { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
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

      const invoices = await InvoiceSchema.find(filter)
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
        .populate({
          path: 'quotationId',
          select: 'quotationNumber subject',
          localField: 'quotationId',
          foreignField: 'quotationId'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const total = await InvoiceSchema.countDocuments(filter);

      return returnSuccess({
        success: true,
        message: 'Invoices search completed successfully',
        data: {
          invoices,
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
        message: 'Error searching invoices',
        error: error.message,
        code: 500
      });
    }
  }

  static async getInvoiceStats(params) {
    try {
      const { userID, contractorId } = params;

      const filter = { userID: userID };
      if (contractorId) filter.contractorId = contractorId;

      const stats = await InvoiceSchema.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            paidAmount: { $sum: '$paidAmount' },
            remainingAmount: { $sum: '$remainingAmount' }
          }
        }
      ]);

      const totalInvoices = await InvoiceSchema.countDocuments(filter);
      const totalAmount = await InvoiceSchema.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const statsObject = {
        total: totalInvoices,
        totalAmount: totalAmount[0]?.total || 0,
        byStatus: {}
      };

      stats.forEach(stat => {
        statsObject.byStatus[stat._id] = {
          count: stat.count,
          totalAmount: stat.totalAmount,
          paidAmount: stat.paidAmount,
          remainingAmount: stat.remainingAmount
        };
      });

      return returnSuccess({
        success: true,
        message: 'Invoice statistics retrieved successfully',
        data: statsObject
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving invoice statistics',
        error: error.message,
        code: 500
      });
    }
  }

  static async sendInvoice(params) {
    try {
      const { userID, invoiceId, sendMethod, sentBy } = params;

      const invoice = await InvoiceSchema.findOne({
        invoiceId: invoiceId,
        userID: userID
      });

      if (!invoice) {
        return returnError({
          success: false,
          message: 'Invoice not found',
          code: 404
        });
      }

      if (invoice.status === 'sent') {
        return returnError({
          success: false,
          message: 'Invoice has already been sent',
          code: 400
        });
      }

      // Update invoice status and sent timestamp
      const updatedInvoice = await InvoiceSchema.findOneAndUpdate(
        { invoiceId: invoiceId, userID: userID },
        {
          status: 'sent',
          sentAt: new Date(),
          updatedBy: sentBy
        },
        { new: true }
      );

      // Here you would typically integrate with email/SMS service
      // For now, we'll just return success

      return returnSuccess({
        success: true,
        message: `Invoice sent successfully via ${sendMethod}`,
        data: updatedInvoice
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error sending invoice',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = Invoice; 