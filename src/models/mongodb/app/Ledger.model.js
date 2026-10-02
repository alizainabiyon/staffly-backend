const { v4: uuid } = require('uuid');

const {
  Ledger: LedgerSchema,
} = require('../../../schemas/mongoDB/App/ledger.schema');
const {
  Expense: ExpenseSchema,
} = require('../../../schemas/mongoDB/App/expense.schema');

// @Helper Functions
const {
  returnSuccess,
  returnError,
} = require('../../../utils/helperFunctions');

class Ledger extends LedgerSchema {

  static async createLedgerEntry(params) {
    try {
      const ledgerData = {
        ledgerId: params?.ledgerId || `ledger-${uuid()}`,
        userID: params.userID,
        ledgerType: params.ledgerType,
        customerId: params.customerId || null,
        vendorId: params.vendorId || null,
        directorId: params.directorId || null,
        calculation: params.calculation || {},
        transactions: params.transactions || [],
        createdBy: params.createdBy || null,
        updatedBy: params.updatedBy || null,
      };

      const newLedger = await Ledger.create(ledgerData);
      
      return returnSuccess({
        success: true,
        message: 'Ledger entry created successfully',
        data: newLedger
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating ledger entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllLedgerEntries(params) {
    try {
      const {
        userID,
        ledgerType,
        customerId,
        vendorId,
        directorId,
        page,
        limit
      } = params;

      const filter = { userID: userID };
      
      if (ledgerType) filter.ledgerType = ledgerType;
      if (customerId) filter.customerId = customerId;
      if (vendorId) filter.vendorId = vendorId;
      if (directorId) filter.directorId = directorId;

      const skip = (page - 1) * limit;

      const ledgerEntries = await LedgerSchema.find(filter)
        .populate('customerId', 'name companyName email phone')
        .populate('vendorId', 'name companyName')
        .populate('directorId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await LedgerSchema.countDocuments(filter);

      return returnSuccess({
        success: true,
        message: 'Ledger entries retrieved successfully',
        data: {
          ledgerEntries,
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
        message: 'Error retrieving ledger entries',
        error: error.message,
        code: 500
      });
    }
  }

  static async getLedgerEntry(params) {
    try {
      const { userID, ledgerType, customerId, vendorId, directorId } = params;

      const filter = { userID: userID };
      
      if (ledgerType) filter.ledgerType = ledgerType;
      if (customerId) filter.customerId = customerId;
      if (vendorId) filter.vendorId = vendorId;
      if (directorId) filter.directorId = directorId;

      const ledgerEntry = await LedgerSchema.findOne(filter).lean();

      if (!ledgerEntry) {
        return returnError({
          success: false,
          message: 'Ledger entry not found',
          error: 'Ledger entry not found',
          code: 404
        });
      }
      return returnSuccess({
        success: true,
        message: 'Ledger entry retrieved successfully',
        data: ledgerEntry
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving ledger entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateLedgerEntry(params) {
    try {
      


      return returnSuccess({
        success: true,
        message: 'Ledger entry updated successfully',
        data: updatedLedgerEntry
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating ledger entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteLedgerEntry(params) {
    try {
      const { userID, ledgerId } = params;

      const ledgerEntry = await LedgerSchema.findOne({
        ledgerId: ledgerId,
        userID: userID
      });

      if (!ledgerEntry) {
        return returnError({
          success: false,
          message: 'Ledger entry not found',
          error: 'Ledger entry not found',
          code: 404
        });
      }

      await LedgerSchema.findOneAndDelete({
        ledgerId: ledgerId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Ledger entry deleted successfully',
        data: null
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting ledger entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async addTransaction(params) {
    try {
      const { userID, ledgerId, transaction } = params;
      const ledgerEntry = await LedgerSchema.findOne({
        ledgerId: ledgerId,
        userID: userID
      });
        return returnSuccess({
        success: true,
        message: 'Ledger entry retrieved successfully',
        data: ledgerEntry
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error adding transaction',
        error: error.message,
        code: 500
      });
    }
  }
  static async addInvoiceTransaction(params) {
    try {
      const { userID, ledgerType, customerId, transaction } = params;
      const ledgerEntry = await LedgerSchema.findOne({
        ledgerType: ledgerType,
        customerId: customerId,
        userID: userID
      });
      transaction.transactionId = `transaction-${uuid()}`;
      transaction.closingBalance = ledgerEntry.calculation.closingBalance + transaction.amount;
    let updatePayload = {
      calculation: {
        closingBalance: ledgerEntry.calculation.closingBalance + transaction.amount,
      },
      transactions: [...ledgerEntry.transactions, transaction]
    }
    const updatedLedgerEntry = await LedgerSchema.findOneAndUpdate({
      customerId: customerId,
      ledgerType: ledgerType,
      userID: userID
    }, updatePayload, { new: true });

      return returnSuccess({
        success: true,
        message: 'Ledger entry created successfully',
        data: { updatedLedgerEntry }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error adding transaction',
        error: error.message,
        code: 500
      });
    }
  }
  static async addVendorOrderTransaction(params) {
    try {
      const { userID, ledgerType, vendorId, transaction } = params;
      const ledgerEntry = await LedgerSchema.findOne({
        ledgerType: ledgerType,
        vendorId: vendorId,
        userID: userID
      });
      transaction.transactionId = `transaction-${uuid()}`;
      transaction.openingBalance = ledgerEntry.calculation.closingBalance;
      transaction.closingBalance = ledgerEntry.calculation.closingBalance + transaction.amount;
    let updatePayload = {
      calculation: {
        closingBalance: ledgerEntry.calculation.closingBalance + transaction.amount,
      },
      transactions: [...ledgerEntry.transactions, transaction]
    }
    const updatedLedgerEntry = await LedgerSchema.findOneAndUpdate({
      vendorId: vendorId,
      ledgerType: ledgerType,
      userID: userID
    }, updatePayload, { new: true });

      return returnSuccess({
        success: true,
        message: 'Ledger entry created successfully',
        data: { updatedLedgerEntry }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error adding transaction',
        error: error.message,
        code: 500
      });
    }
  }
  static async addCustomerTransaction(params) {
    try {
      const { userID, customerId, destinationType, amount, paymentType, paymentMethod, purpose, description, directorId } = params;
      
              // Validate required parameters
        if (!userID || !customerId || !destinationType || !amount || !paymentType || !paymentMethod || !purpose || !description) {
          return returnError({
            success: false,
            message: 'Missing required parameters',
            code: 400
          });
        }

      // Find customer ledger entry
      const customerLedgerEntry = await LedgerSchema.findOne({
        ledgerType: 'customer',
        customerId: customerId,
        userID: userID
      });

      if (!customerLedgerEntry) {
        return returnError({
          success: false,
          message: 'Customer ledger not found',
          code: 404
        });
      }

      // Create transaction object
      const transaction = {
        transactionId: `transaction-${uuid()}`,
        amount: amount,
        openingBalance: customerLedgerEntry.calculation.closingBalance,
        closingBalance: customerLedgerEntry.calculation.closingBalance - amount, // Customer pays, so balance decreases
        paymentType: paymentType,
        paymentMethod: paymentMethod,
        senderType: 'customer',
        receiverType: destinationType,
        purpose: purpose,
        description: description,
        transactionDate: new Date(),
        currency: 'PKR'
      };

      // Add receiver ID if destination is director
      if (destinationType === 'director' && directorId) {
        transaction.receiverId = directorId;
      }

      // Update customer ledger
      const customerUpdatePayload = {
        calculation: {
          openingBalance: customerLedgerEntry.calculation.closingBalance,
          closingBalance: customerLedgerEntry.calculation.closingBalance - amount, // Customer pays, so balance decreases
        },
        transactions: [...customerLedgerEntry.transactions, transaction]
      };

      const updatedCustomerLedger = await LedgerSchema.findOneAndUpdate(
        {
          customerId: customerId,
          ledgerType: 'customer',
          userID: userID
        },
        customerUpdatePayload,
        { new: true }
      );

      // Find and update destination ledger
      const destinationQuery = {
        ledgerType: destinationType,
        userID: userID
      };

      if (destinationType === 'director' && directorId) {
        destinationQuery.directorId = directorId;
      }

      const destinationLedgerEntry = await LedgerSchema.findOne(destinationQuery);
      
      if (destinationLedgerEntry) {
        transaction.openingBalance = destinationLedgerEntry.calculation.closingBalance;
        transaction.closingBalance = destinationLedgerEntry.calculation.closingBalance + amount;
        // Update destination ledger with received amount
        const destinationUpdatePayload = {
          calculation: {
            openingBalance: destinationLedgerEntry.calculation.closingBalance,
            closingBalance: destinationLedgerEntry.calculation.closingBalance + amount, // Destination receives, so balance increases
            totalCash: paymentMethod === 'cash' 
              ? destinationLedgerEntry.calculation.totalCash + amount 
              : destinationLedgerEntry.calculation.totalCash,
            totalBank: paymentMethod === 'bank' 
              ? destinationLedgerEntry.calculation.totalBank + amount 
              : destinationLedgerEntry.calculation.totalBank,
          },
          transactions: [...destinationLedgerEntry.transactions, transaction]
        };

        await LedgerSchema.findOneAndUpdate(
          destinationQuery,
          destinationUpdatePayload,
          { new: true }
        );
      }

      return returnSuccess({
        success: true,
        message: 'Customer transaction added successfully',
        data: {
          transactionId: transaction.transactionId,
          customerLedger: updatedCustomerLedger,
          amount: amount,
          destinationType: destinationType
        }
      });

    } catch (error) {
      console.error('Error in addCustomerTransaction:', error);
      return returnError({
        success: false,
        message: 'Error adding customer transaction',
        error: error.message,
        code: 500
      });
    }
  }
  static async addVendorTransaction(params) {
    try {
      const { userID, vendorId, destinationType, amount, paymentType, paymentMethod, purpose, description, directorId, entryType } = params;
      console.log('params', params)
      
              // Validate required parameters
        if (!userID || !vendorId || !destinationType || !amount || !paymentType || !paymentMethod || !purpose || !description) {
          return returnError({
            success: false,
            message: 'Missing required parameters',
            code: 400
          });
        }

      // Find vendor ledger entry
      const vendorLedgerEntry = await LedgerSchema.findOne({
        ledgerType: 'vendor',
        vendorId: vendorId,
        userID: userID
      });

      if (!vendorLedgerEntry) {
        return returnError({
          success: false,
          message: 'Vendor ledger not found',
          code: 404
        });
      }

      // Create transaction object
      const transaction = {
        transactionId: `transaction-${uuid()}`,
        amount: amount,
        openingBalance: vendorLedgerEntry.calculation.closingBalance,
        closingBalance: vendorLedgerEntry.calculation.closingBalance - amount, // Vendor pays, so balance decreases
        paymentType: paymentType,
        paymentMethod: paymentMethod,
        senderType: destinationType,
        receiverType: 'vendor',
        purpose: purpose,
        description: description,
        transactionDate: new Date(),
        currency: 'PKR'
      };

      // Add receiver ID if destination is director
      if (entryType === 'vendor' && vendorId) {
        transaction.receiverId = vendorId;
      }

      // Update vendor ledger
      const vendorUpdatePayload = {
        calculation: {
          openingBalance: vendorLedgerEntry.calculation.closingBalance,
          closingBalance: vendorLedgerEntry.calculation.closingBalance - amount, // Vendor pays, so balance decreases
        },
        transactions: [...vendorLedgerEntry.transactions, transaction]
      };

      const updatedVendorLedger = await LedgerSchema.findOneAndUpdate(
        {
          vendorId: vendorId,
          ledgerType: 'vendor',
          userID: userID
        },
        vendorUpdatePayload,
        { new: true }
      );

      // Find and update destination ledger
      const senderQuery = {
        ledgerType: destinationType,
        userID: userID
      };

      if (destinationType === 'director' && directorId) {
        senderQuery.directorId = directorId;
      }

      const senderLedgerEntry = await LedgerSchema.findOne(senderQuery);
      
      if (senderLedgerEntry) {
        transaction.openingBalance = senderLedgerEntry.calculation.closingBalance;
        transaction.closingBalance = senderLedgerEntry.calculation.closingBalance - amount;
        // Update destination ledger with received amount
        const senderUpdatePayload = {
          calculation: {
            openingBalance: senderLedgerEntry.calculation.closingBalance,
            closingBalance: senderLedgerEntry.calculation.closingBalance - amount, // Destination receives, so balance increases
            totalCash: paymentMethod === 'cash' 
              ? senderLedgerEntry.calculation.totalCash - amount 
              : senderLedgerEntry.calculation.totalCash,
            totalBank: paymentMethod === 'bank' 
              ? senderLedgerEntry.calculation.totalBank - amount 
              : senderLedgerEntry.calculation.totalBank,
          },
          transactions: [...senderLedgerEntry.transactions, transaction]
        };

        await LedgerSchema.findOneAndUpdate(
          senderQuery,
          senderUpdatePayload,
          { new: true }
        );
      }

      return returnSuccess({
        success: true,
        message: 'Vendor transaction added successfully',
        data: {}
      });

    } catch (error) {
      console.error('Error in addVendorTransaction:', error);
      return returnError({
        success: false,
        message: 'Error adding vendor transaction',
        error: error.message,
        code: 500
      });
    }
  }
  static async addExpenseTransaction(params) {
    try {
      const { userID, destinationType, amount, paymentType, paymentMethod, purpose, description, directorId, entryType, expenseType, expenseCategory, employeeId} = params;
      console.log('params', params)
      
      if(entryType !== 'expense'){
        return returnError({
          success: false,
          message: 'Invalid entry type',
          code: 400
        });
      }
      if(expenseCategory !== 'office' && expenseCategory !== 'director' && expenseCategory !== 'employee'){
        return returnError({
          success: false,
          message: 'Invalid expense category',
          code: 400
        });
      }
      const expensePayload = {
        expenseId: `expense-${uuid()}`,
        userID: userID, 
        expenseDate: new Date(),
        catagory: expenseCategory,
        type: expenseType,
        amount: amount,
        description: description,
        createdBy: userID,
      }
      if(expenseCategory === 'director'){
        expensePayload.directorId = directorId;
      }
      if(expenseCategory === 'employee'){
        expensePayload.employeeId = employeeId;
      }

      await ExpenseSchema.create(expensePayload);


      // Create transaction object
      const transaction = {
        transactionId: `transaction-${uuid()}`,
        amount: amount,
        paymentType: paymentType,
        paymentMethod: paymentMethod,
        senderType: destinationType,
        receiverType: entryType,
        purpose: purpose,
        description: description,
        transactionDate: new Date(),
        currency: 'PKR'
      };

      // Find and update destination ledger
      const senderQuery = {
        ledgerType: destinationType,
        userID: userID
      };

      if (destinationType === 'director' && directorId) {
        senderQuery.directorId = directorId;
      }

      const senderLedgerEntry = await LedgerSchema.findOne(senderQuery);
      
      if (senderLedgerEntry) {
        transaction.openingBalance = senderLedgerEntry.calculation.closingBalance;
        transaction.closingBalance = senderLedgerEntry.calculation.closingBalance - amount;
        // Update destination ledger with received amount
        const senderUpdatePayload = {
          calculation: {
            openingBalance: senderLedgerEntry.calculation.closingBalance,
            closingBalance: senderLedgerEntry.calculation.closingBalance - amount, // Destination receives, so balance increases
            totalCash: paymentMethod === 'cash' 
              ? senderLedgerEntry.calculation.totalCash - amount 
              : senderLedgerEntry.calculation.totalCash,
            totalBank: paymentMethod === 'bank' 
              ? senderLedgerEntry.calculation.totalBank - amount 
              : senderLedgerEntry.calculation.totalBank,
          },
          transactions: [...senderLedgerEntry.transactions, transaction]
        };

        await LedgerSchema.findOneAndUpdate(
          senderQuery,
          senderUpdatePayload,
          { new: true }
        );
      }

      return returnSuccess({
        success: true,
        message: 'Expense transaction added successfully',
        data: {}
      });

    } catch (error) {
      console.error('Error in addExpenseTransaction:', error);
      return returnError({
        success: false,
        message: 'Error adding expense transaction',
        error: error.message,
        code: 500
      });
    }
  }

}

module.exports = Ledger; 