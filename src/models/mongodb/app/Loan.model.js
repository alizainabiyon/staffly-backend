const {
  Loan: LoanSchema,
} = require('../../../schemas/mongoDB/App/loan.schema');

const {
  Employee: EmployeeSchema,
} = require('../../../schemas/mongoDB/App/employee.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Loan extends LoanSchema {
  static async create(data) {
    const loan = await LoanSchema.create(data);
    if (!loan) {
      return returnError(errorDB('Loan not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Loan created successfully',
      data: loan,
    });
  }

  static async createLoan(params) {
    try {
      const {
        userID,
        employeeId,
        loanType,
        loanAmount,
        interestRate,
        totalInstallments,
        startDate,
        purpose,
        guarantor,
        documents,
        remarks
      } = params;

      // Validate employee exists
      const employee = await EmployeeSchema.findOne({ 
        employeeId: employeeId,
        userID: userID,
        status: 'active'
      });

      if (!employee) {
        return returnError({
          success: false,
          message: 'Employee not found or not active',
          code: 404
        });
      }

      // Calculate loan details
      const totalAmount = loanAmount + (loanAmount * interestRate / 100);
      const installmentAmount = totalAmount / totalInstallments;
      const remainingAmount = totalAmount;
      
      // Calculate end date (assuming monthly installments)
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + totalInstallments);
      
      // Calculate next installment date (1 month from start date)
      const nextInstallmentDate = new Date(startDate);
      nextInstallmentDate.setMonth(nextInstallmentDate.getMonth() + 1);

      // Generate installments array
      const installments = [];
      for (let i = 1; i <= totalInstallments; i++) {
        const installmentDate = new Date(startDate);
        installmentDate.setMonth(installmentDate.getMonth() + i);
        
        installments.push({
          installmentNumber: i,
          dueDate: installmentDate,
          amount: installmentAmount,
          paidAmount: 0,
          paidDate: null,
          status: 'pending',
          remarks: ''
        });
      }

      const loanData = {
        loanId: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employeeId: employeeId,
        loanType: loanType,
        loanAmount: loanAmount,
        interestRate: interestRate,
        totalAmount: totalAmount,
        installmentAmount: installmentAmount,
        totalInstallments: totalInstallments,
        paidInstallments: 0,
        remainingAmount: remainingAmount,
        startDate: new Date(startDate),
        endDate: endDate,
        nextInstallmentDate: nextInstallmentDate,
        status: 'pending',
        purpose: purpose,
        guarantor: guarantor,
        documents: documents || [],
        installments: installments,
        remarks: remarks || '',
        userID: userID
      };

      const loan = await LoanSchema.create(loanData);
      return returnSuccess({
        success: true,
        message: 'Loan application created successfully',
        data: loan,
      });
    } catch (error) {
      return returnError(errorDB('Failed to create loan'));
    }
  }

  static async getAllLoans(params) {
    try {
      const {
        userID,
        employeeId,
        loanType,
        status,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { userID };

      // Employee filter
      if (employeeId) {
        query.employeeId = employeeId;
      }

      // Loan type filter
      if (loanType) {
        query.loanType = loanType;
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Date range filter (startDate)
      if (dateFrom || dateTo) {
        query.startDate = {};
        if (dateFrom) {
          query.startDate.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.startDate.$lte = new Date(dateTo);
        }
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination and populate employee details
      const loans = await LoanSchema.find(query)
        .populate('employeeId', 'name email department position')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await LoanSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Loans retrieved successfully',
        data: {
          loans,
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
      return returnError(errorDB('Failed to retrieve loans'));
    }
  }

  static async getLoanById(params) {
    try {
      const { userID, loanId } = params;

      const loan = await LoanSchema.findOne({ 
        loanId: loanId,
        userID: userID 
      }).populate('employeeId', 'name email department position phone address');

      if (!loan) {
        return returnError({
          success: false,
          message: 'Loan not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Loan details retrieved successfully',
        data: loan,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve loan details'));
    }
  }

  static async getEmployeeLoans(params) {
    try {
      const {
        userID,
        employeeId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = params;

      // Build query object
      const query = { 
        userID,
        employeeId: employeeId
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
      const loans = await LoanSchema.find(query)
        .populate('employeeId', 'name email department position')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalCount = await LoanSchema.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      return returnSuccess({
        success: true,
        message: 'Employee loans retrieved successfully',
        data: {
          loans,
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
      return returnError(errorDB('Failed to retrieve employee loans'));
    }
  }

  static async updateLoanStatus(params) {
    try {
      const { userID, loanId, status, approvedBy, remarks } = params;

      const updateData = { status };
      
      if (status === 'approved') {
        updateData.approvedBy = approvedBy;
        updateData.approvedAt = new Date();
      }
      
      if (remarks) {
        updateData.remarks = remarks;
      }

      const loan = await LoanSchema.findOneAndUpdate(
        { loanId: loanId, userID: userID },
        updateData,
        { new: true }
      ).populate('employeeId', 'name email department position');

      if (!loan) {
        return returnError({
          success: false,
          message: 'Loan not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Loan status updated successfully',
        data: loan,
      });
    } catch (error) {
      return returnError(errorDB('Failed to update loan status'));
    }
  }

  static async payInstallment(params) {
    try {
      const { userID, loanId, installmentNumber, paidAmount, remarks } = params;

      const loan = await LoanSchema.findOne({ 
        loanId: loanId,
        userID: userID 
      });

      if (!loan) {
        return returnError({
          success: false,
          message: 'Loan not found',
          code: 404
        });
      }

      if (loan.status !== 'active' && loan.status !== 'approved') {
        return returnError({
          success: false,
          message: 'Loan is not active for payment',
          code: 400
        });
      }

      // Find the installment
      const installment = loan.installments.find(inst => inst.installmentNumber === installmentNumber);
      if (!installment) {
        return returnError({
          success: false,
          message: 'Installment not found',
          code: 404
        });
      }

      if (installment.status === 'paid') {
        return returnError({
          success: false,
          message: 'Installment already paid',
          code: 400
        });
      }

      // Update installment
      installment.paidAmount = paidAmount;
      installment.paidDate = new Date();
      installment.remarks = remarks || '';

      if (paidAmount >= installment.amount) {
        installment.status = 'paid';
        loan.paidInstallments += 1;
      } else {
        installment.status = 'partial';
      }

      // Update loan totals
      loan.remainingAmount = loan.totalAmount - (loan.paidInstallments * loan.installmentAmount);
      
      // Update next installment date
      if (installment.status === 'paid') {
        const nextInstallment = loan.installments.find(inst => 
          inst.installmentNumber === installmentNumber + 1 && inst.status === 'pending'
        );
        if (nextInstallment) {
          loan.nextInstallmentDate = nextInstallment.dueDate;
        }
      }

      // Check if loan is completed
      if (loan.paidInstallments === loan.totalInstallments) {
        loan.status = 'completed';
        loan.remainingAmount = 0;
      } else if (loan.status === 'pending') {
        loan.status = 'active';
      }

      await loan.save();

      return returnSuccess({
        success: true,
        message: 'Installment payment processed successfully',
        data: loan,
      });
    } catch (error) {
      return returnError(errorDB('Failed to process installment payment'));
    }
  }

  static async updateLoan(loanId, data) {
    const loan = await LoanSchema.findOneAndUpdate(
      { loanId: loanId }, 
      data, 
      { new: true }
    ).populate('employeeId', 'name email department position');
    
    if (!loan) {
      return returnError(errorDB('Loan not updated'));
    }
    return returnSuccess({
      success: true,
      message: 'Loan updated successfully',
      data: loan,
    });
  }

  static async deleteLoan(params) {
    try {
      const { userID, loanId } = params;

      const loan = await LoanSchema.findOneAndDelete({ 
        loanId: loanId,
        userID: userID 
      });

      if (!loan) {
        return returnError({
          success: false,
          message: 'Loan not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Loan deleted successfully',
        data: null,
      });
    } catch (error) {
      return returnError(errorDB('Failed to delete loan'));
    }
  }
}

module.exports = Loan; 