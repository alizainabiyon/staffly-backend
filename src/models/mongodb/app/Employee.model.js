const {
  Employee: EmployeeSchema,
} = require('../../../schemas/mongoDB/App/employee.schema');
const {
  Expense: ExpenseSchema,
} = require('../../../schemas/mongoDB/App/expense.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Employee extends EmployeeSchema {
  static async create(data) {
    const employee = await EmployeeSchema.create(data);
    if (!employee) {
      return returnError(errorDB('Employee not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  }

  static async getAllEmployees(params) {
    try {
      const {
        userID,
        search,
        status,
        dateFrom,
        dateTo,
        category,
        department,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { userID: userID };

      // Search filter (name)
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Department filter
      if (department) {
        query.department = department;
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Date range filter (joinDate)
      if (dateFrom || dateTo) {
        query.joinDate = {};
        if (dateFrom) {
          query.joinDate.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.joinDate.$lte = new Date(dateTo);
        }
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const employees = await EmployeeSchema.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await EmployeeSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Employees retrieved successfully',
        data: {
          employees,
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
      return returnError(errorDB('Failed to retrieve employees'));
    }
  }

  static async getEmployeeById(params) {
    try {
      const { userID, employeeId } = params;

      // Find employee by employeeId (not _id)
      let employee = await EmployeeSchema.findOne({ employeeId: employeeId });

      if(!employee){
        return returnError({
          success: false,
          message: 'Employee not found',
          code: 404
        });
      }

      const expense = await ExpenseSchema.find({ employeeId: employeeId });
      const attendance = await AttendanceSchema.find({userID: userID, employeeId: employeeId });

      return returnSuccess({
        success: true,
        message: 'Employee retrieved successfully',
        data: {
          employee,
          expense,
          attendance
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee'));
    }
  }

  static async update(employeeId, data) {
    const employee = await EmployeeSchema.findOneAndUpdate({ employeeId: employeeId }, data, { new: true });
    if (!employee) {
      return returnError(errorDB('Employee not updated'));
    }
    return returnSuccess({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  }

  static async getEmployeeExpenses(params) {
    try {
      const { userID, employeeId, month, year } = params;

      // Build query object
      const query = {
        employeeId,
        userID,
        catagory: 'employee' // Only get employee expenses
      };

      // Add date filtering if month and/or year are provided
      if (month && year) {
        // Create date range for the specific month and year
        const startDate = new Date(year, month - 1, 1); // month is 0-indexed in Date constructor
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
        
        query.expenseDate = {
          $gte: startDate,
          $lte: endDate
        };
      } else if (year) {
        // Filter by year only
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        
        query.expenseDate = {
          $gte: startDate,
          $lte: endDate
        };
      }

      const employeeExpenses = await ExpenseSchema.find(query).sort({ expenseDate: -1 });
      
      // Calculate total amount
      const totalAmount = employeeExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

      return returnSuccess({
        success: true,
        message: 'Employee expenses retrieved successfully',
        data: {
          expenses: employeeExpenses,
          totalAmount,
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee expenses'));
    }
  }
}

module.exports = Employee;
