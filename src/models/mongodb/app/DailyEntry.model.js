const _ = require('lodash');
const {
  DailyEntry: DailyEntrySchema,
} = require('../../../schemas/mongoDB/App/dailyEntry.schema');
const LedgerModel = require('../../../models/mongodb/app/Ledger.model');


// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class DailyEntry extends DailyEntrySchema {

  static async createEntry(params) {
    try {
      const result = await DailyEntry.create(params);

      return returnSuccess({
        success: true,
        message: 'Daily entry created successfully',
        data: result,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating daily entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllEntries(params) {
    try {
      const {
        userID,
        contractorId,
        customerId,
        vendorId,
        employeeId,
        directorId,
        entryType,
        paymentType,
        destinationType,
        entryClearStatus,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      const query = { userID };

      if (contractorId) query.contractorId = contractorId;
      if (customerId) query.customerId = customerId;
      if (vendorId) query.vendorId = vendorId;
      if (employeeId) query.employeeId = employeeId;
      if (directorId) query.directorId = directorId;
      if (entryType) query.entryType = entryType;
      if (paymentType) query.paymentType = paymentType;
      if (destinationType) query.destinationType = destinationType;
      if (entryClearStatus) query.entryClearStatus = entryClearStatus;
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const entries = await DailyEntrySchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await DailyEntrySchema.countDocuments(query);

      return returnSuccess({
        success: true,
        message: 'Daily entries retrieved successfully',
        data: {
          entries,
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
        message: 'Error retrieving daily entries',
        error: error.message,
        code: 500
      });
    }
  }

  static async getEntryById(params) {
    try {
      const { userID, entryId } = params;

      const entry = await DailyEntrySchema.findOne({
        entryId: entryId,
        userID: userID
      }).populate({
        path: 'customerId',
        select: 'name companyName',
        localField: 'customerId',
        foreignField: 'customerId'
      }).populate({
        path: 'vendorId',
        select: 'name companyName',
        localField: 'vendorId',
        foreignField: 'vendorId'
      }).populate({
        path: 'employeeId',
        select: 'name companyName',
        localField: 'employeeId',
        foreignField: 'employeeId'
      }).populate({
        path: 'directorId',
        select: 'name companyName',
        localField: 'directorId',
        foreignField: 'directorId'
      })

      if (!entry) {
        return returnError({
          success: false,
          message: 'Daily entry not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Daily entry retrieved successfully',
        data: entry
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving daily entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateEntry(params) {
    try {
      const {
        userID,
        entryId,
        updateData
      } = params;

      const entry = await DailyEntrySchema.findOne({
        entryId: entryId,
        userID: userID
      });

      if (!entry) {
        return returnError({
          success: false,
          message: 'Daily entry not found',
          code: 404
        });
      }

      const updatedEntry = await DailyEntrySchema.findOneAndUpdate(
        { entryId: entryId, userID: userID },
        updateData,
        { new: true }
      );

      return returnSuccess({
        success: true,
        message: 'Daily entry updated successfully',
        data: updatedEntry
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating daily entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteEntry(params) {
    try {
      const { userID, entryId } = params;

      const entry = await DailyEntrySchema.findOne({
        entryId: entryId,
        userID: userID
      });

      if (!entry) {
        return returnError({
          success: false,
          message: 'Daily entry not found',
          code: 404
        });
      }

      await DailyEntrySchema.findOneAndDelete({
        entryId: entryId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Daily entry deleted successfully'
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting daily entry',
        error: error.message,
        code: 500
      });
    }
  }
  static async saveTodayEntries(params) {
    try {
      const {
        userID,
      } = params;

      const draftEntries = await DailyEntrySchema.find({status: 'draft', userID: userID});
    
      if (draftEntries.length > 0) {
        let entryIds  = _.map(draftEntries, 'entryId');
        for (const entry of draftEntries) {
        switch (entry.entryType) {
          case 'customer':
            await LedgerModel.addCustomerTransaction(entry);
            break;
          case 'vendor':
            await LedgerModel.addVendorTransaction(entry);
            break;
          case 'expense':
            await LedgerModel.addExpenseTransaction(entry);
            break;
          default:
            break;
        }
      }
      await DailyEntrySchema.updateMany({entryId: {$in: entryIds}}, {status: 'completed'});

      }

      return returnSuccess({
        success: true,
        message: 'Daily entry saved successfully',
        data: {}
      });

    } catch (error) {
      return returnError({
        success: false,
        message: 'Error saving daily entry',
        error: error.message,
        code: 500
      });
    }
  }

  static async getEntriesByDateOrBetweenDates(params) {
    try {
      const {
        userID,
        startDate,
        endDate,
        singleDate,
        contractorId,
        customerId,
        vendorId,
        employeeId,
        directorId,
        entryType,
        paymentType,
        destinationType,
        entryClearStatus,
        status,
      } = params;

      const query = { userID };

      // Date filtering logic
      if (singleDate) {
        // For single date, find entries for that specific date
        const startOfDay = new Date(singleDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(singleDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        query.entryDate = {
          $gte: startOfDay,
          $lte: endOfDay
        };
      } else if (startDate && endDate) {
        // For date range, find entries between start and end dates
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        query.entryDate = {
          $gte: start,
          $lte: end
        };
      } else {
        return returnError({
          success: false,
          message: 'Either singleDate or both startDate and endDate must be provided',
          code: 400
        });
      }

      // Additional filters
      if (contractorId) query.contractorId = contractorId;
      if (customerId) query.customerId = customerId;
      if (vendorId) query.vendorId = vendorId;
      if (employeeId) query.employeeId = employeeId;
      if (directorId) query.directorId = directorId;
      if (entryType) query.entryType = entryType;
      if (paymentType) query.paymentType = paymentType;
      if (destinationType) query.destinationType = destinationType;
      if (entryClearStatus) query.entryClearStatus = entryClearStatus;
      if (status) query.status = status;

      // Sort by entry date descending (most recent first)
      const sort = { entryDate: -1 };

      const entries = await DailyEntrySchema.find(query)
        .sort(sort)
        .lean();

      const total = await DailyEntrySchema.countDocuments(query);

      return returnSuccess({
        success: true,
        message: 'Daily entries retrieved successfully',
        data: {
          entries,
          total,
          dateRange: singleDate ? { singleDate } : { startDate, endDate }
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving daily entries by date',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = DailyEntry; 