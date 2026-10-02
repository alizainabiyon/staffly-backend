const {
  Director: DirectorSchema,
} = require('../../../schemas/mongoDB/App/director.schema');

const LedgerModel = require('../../../models/mongodb/app/Ledger.model');
const {
  Expense: ExpenseSchema,
} = require('../../../schemas/mongoDB/App/expense.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Director extends DirectorSchema {

  static async createDirector(params) {
    try {
      const result = await DirectorSchema.create(params);
      if(result) {
        await LedgerModel.createLedgerEntry({
          userID: params.userID,
          ledgerType: 'director',
          directorId: result.directorId,
          createdBy: params.createdBy,
        });
      }

      return returnSuccess({
        success: true,
        message: 'Director created successfully',
        data: result,
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error creating director',
        error: error.message,
        code: 500
      });
    }
  }

  static async getAllDirectors(params) {
    try {
      const {
        userID,
        name,
        email,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      const query = { userID };

      if (name) query.name = { $regex: name, $options: 'i' };
      if (email) query.email = { $regex: email, $options: 'i' };
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const directors = await DirectorSchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await DirectorSchema.countDocuments(query);

      return returnSuccess({
        success: true,
        message: 'Directors retrieved successfully',
        data: {
          directors,
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
        message: 'Error retrieving directors',
        error: error.message,
        code: 500
      });
    }
  }

  static async getDirectorById(params) {
    try {
      const { userID, directorId } = params;

      const director = await DirectorSchema.findOne({
        userID: userID,
        directorId: directorId,
      }).lean();

      if (!director) {
        return returnError({
          success: false,
          message: 'Director not found',
          code: 404
        });
      }
      let ledger = null;
      try {
        // Fetch ledger entries for this director
        const ledgerResult = await LedgerModel.getLedgerEntry({
          userID: userID,
          ledgerType: 'director',
          directorId: directorId,
        });
        ledger = ledgerResult?.data || null;
      } catch (ledgerError) {
        console.log('Error fetching ledger:', ledgerError.message);
      }

      const expense = await ExpenseSchema.find({ directorId: directorId });

      return returnSuccess({
        success: true,
        message: 'Director retrieved successfully',
        data: {
          director: director,
          ledger: ledger,
          expense: expense,
        },
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error retrieving director',
        error: error.message,
        code: 500
      });
    }
  }

  static async updateDirector(params) {
    try {
      const {
        userID,
        directorId,
        updateData
      } = params;

      const director = await DirectorSchema.findOne({
        directorId: directorId,
        userID: userID
      });

      if (!director) {
        return returnError({
          success: false,
          message: 'Director not found',
          code: 404
        });
      }

      const updatedDirector = await DirectorSchema.findOneAndUpdate(
        { directorId: directorId, userID: userID },
        updateData,
        { new: true }
      );

      return returnSuccess({
        success: true,
        message: 'Director updated successfully',
        data: updatedDirector
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error updating director',
        error: error.message,
        code: 500
      });
    }
  }

  static async deleteDirector(params) {
    try {
      const { userID, directorId } = params;

      const director = await DirectorSchema.findOne({
        directorId: directorId,
        userID: userID
      });

      if (!director) {
        return returnError({
          success: false,
          message: 'Director not found',
          code: 404
        });
      }

      await DirectorSchema.findOneAndDelete({
        directorId: directorId,
        userID: userID
      });

      return returnSuccess({
        success: true,
        message: 'Director deleted successfully'
      });
    } catch (error) {
      return returnError({
        success: false,
        message: 'Error deleting director',
        error: error.message,
        code: 500
      });
    }
  }
}

module.exports = Director; 