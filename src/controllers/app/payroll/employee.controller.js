// @Dependencies

// @Models
const EmployeeModel = require('../../../models/mongodb/app/Employee.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

// hello
const employee = {};

employee.create = async (req, res, next) => {
  let { employeeId, name, email, phone, address, address2, age, cnic, cast, department, position, joinDate, status, salary, study, profilePic, bankAccount, emergencyContacts, experiences, documents } = req.body;
const { userID } = res.auth;
  try {
    const employeeDto = {
      employeeId,
      name,
      email,
      phone,
      address,
      address2,
      age,
      cnic,
      cast,
      department,
      position,
      joinDate,
      status,
      salary,
      study,
      profilePic,
      bankAccount,
      emergencyContacts,
      experiences,
      documents,
      userID
    };

    const { success, message, data } = await EmployeeModel.create(employeeDto);

    return successResponse({
      res,
      code: 201,
      message: message,
      data: {},
    });
  } catch (e) {
    next(e);
  }
};

employee.update = async (req, res, next) => {
  const { employeeId, name, email, phone, address, address2, age, cnic, cast, department, position, joinDate, status, salary, study, profilePic, bankAccount, emergencyContacts, experiences, documents  } = req.body;
  try {
    const updatedEmployeeDto = {
      name,
      email,
      phone,
      address,
      address2,
      age,
      cnic,
      cast,
      department,
      position,
      joinDate,
      status,
      salary,
      study,
      profilePic,
      bankAccount,
      emergencyContacts,
      experiences,
      documents,
      
    };
    const { success, message, data } = await EmployeeModel.update(employeeId, updatedEmployeeDto);



    return successResponse({
      res,
      code: 200,
      message: 'Employee updated successfully.',
      data: data,
    });
  } catch (e) {
    next(e);
  }
};

employee.getAllEmployees = async (req, res, next) => {
  const { userID } = res.auth;
  const {
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
  } = req.query;

  try {
    const { success, message, data } = await EmployeeModel.getAllEmployees({
      userID,
      search,
      status,
      dateFrom,
      dateTo,
      category,
      department,
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
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
employee.getEmployeeById = async (req, res, next) => {
  const { userID } = res.auth;
  const { employeeId } = req.query;

  try {
    return successResponse({
      res,
      code: 200,
      message: 'Employee retrieved successfully',
      data: await EmployeeModel.findOne({ employeeId }),
    });
  } catch (e) {
    next(e);
  }
};
employee.deleteEmployee = async (req, res, next) => {
  const { userID } = res.auth;
  const { employeeId } = req.query;

  const deletedEmployee = await EmployeeModel.findOneAndDelete({ employeeId })

  try {
    return successResponse({
      res,
      code: 200,
      message: 'Employee deleted successfully',
      data: deletedEmployee,
    });
  } catch (e) {
    next(e);
  }
};
employee.getEmployeeExpenses = async (req, res, next) => {
  const { employeeId, month, year } = req.query;
  const { userID } = res.auth;
  try {
    const { success, message, data } = await EmployeeModel.getEmployeeExpenses({
      userID,
      employeeId,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined
    });

    return successResponse({
      res,
      code: 200,
      message: message,
      data: data,
    });
  }
  catch (e) {
    next(e);
  }
};

module.exports = employee;
