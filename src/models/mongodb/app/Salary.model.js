const {
  Salary: SalarySchema,
} = require('../../../schemas/mongoDB/App/salary.schema');

const {
  Employee: EmployeeSchema,
} = require('../../../schemas/mongoDB/App/employee.schema');

const {
  Loan: LoanSchema,
} = require('../../../schemas/mongoDB/App/loan.schema');

const {
  Attendance: AttendanceSchema,
} = require('../../../schemas/mongoDB/App/attendance.schema');

const {
  Expense: ExpenseSchema,
} = require('../../../schemas/mongoDB/App/expense.schema');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
} = require('../../../utils/helperFunctions');

class Salary extends SalarySchema {
  static async create(data) {
    const salary = await SalarySchema.create(data);
    if (!salary) {
      return returnError(errorDB('Salary not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Salary created successfully',
      data: salary,
    });
  }

  static async generateSalaryOfAllEmployees(params) {
    try {
      const { userID, month, year } = params;
      
      // Validate month and year
      if (!month || !year || month < 1 || month > 12 || year < 2000 || year > 2100) {
        return returnError({
          success: false,
          message: 'Invalid month or year provided',
          code: 400
        });
      }

      // Check if salary already exists for this month/year
      const existingSalaries = await SalarySchema.find({
        month: month,
        year: year,
        userID: userID
      });

      if (existingSalaries && existingSalaries.length > 0) {
        return returnError({
          success: false,
          message: `Salary for month ${month}/${year} has already been generated`,
          code: 409
        });
      }

      // Get all active employees
      const activeEmployees = await EmployeeSchema.find({ 
        status: 'active',
        userID: userID 
      });

      if (!activeEmployees || activeEmployees.length === 0) {
        return returnError({
          success: false,
          message: 'No active employees found',
          code: 404
        });
      }

      const generatedSalaries = [];
      const errors = [];

      for (const employee of activeEmployees) {
        try {
          // Calculate comprehensive salary for this employee
          const salaryCalculation = await this.calculateEmployeeSalary({
            employee,
            month,
            year,
            userID
          });

          if (!salaryCalculation.success) {
            errors.push(`Failed to calculate salary for ${employee.name} (${employee.employeeId}): ${salaryCalculation.message}`);
            continue;
          }

          const salaryData = {
            salaryId: `salary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            employeeId: employee.employeeId,
            month: month,
            year: year,
            basicSalary: salaryCalculation.data.basicSalary,
            overtimeAmount: salaryCalculation.data.overtimeAmount,
            deduction: salaryCalculation.data.deductions,
            grossSalary: salaryCalculation.data.grossSalary,
            netSalary: salaryCalculation.data.netSalary,
            status: 'pending',
            remarks: salaryCalculation.data.remarks,
            userID: userID
          };

          const salary = await SalarySchema.create(salaryData);
          generatedSalaries.push(salary);
        } catch (error) {
          errors.push(`Failed to generate salary for employee ${employee.name} (${employee.employeeId}): ${error.message}`);
        }
      }

      return returnSuccess({
        success: true,
        message: `Salary generation completed. ${generatedSalaries.length} salaries generated successfully.`,
        data: {
          generatedSalaries,
          errors: errors.length > 0 ? errors : undefined,
          summary: {
            totalEmployees: activeEmployees.length,
            successfulGenerations: generatedSalaries.length,
            failedGenerations: errors.length
          }
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to generate salaries'));
    }
  }

  static async calculateEmployeeSalary(params) {
    try {
      const { employee, month, year, userID } = params;
      
      // Constants
      const DAILY_DUTY_HOURS = 9;
      
      // Calculate actual number of days in the specific month
      const daysInMonth = this.getDaysInMonth(month, year);
      const HOURLY_RATE = employee.salary / (daysInMonth * DAILY_DUTY_HOURS);
      
      const LATE_DEDUCTION_RATE = 0.1; // 10% deduction for late arrival
      const ABSENT_DEDUCTION_RATE = 1.0; // Full day deduction for absent
      const HALF_DAY_DEDUCTION_RATE = 0.5; // Half day deduction
      const OVERTIME_RATE = 1.0; // 1.5x hourly rate for overtime
      const HOLIDAY_PAY_RATE = 1.0; // 2x hourly rate for holiday work
      const WEEKEND_PAY_RATE = 1.0; // 1.5x hourly rate for weekend work

      // Get employee's monthly attendance
      const attendanceData = await this.getEmployeeMonthlyAttendance({
        employeeId: employee.employeeId,
        month,
        year,
        userID
      });

      if (!attendanceData.success) {
        return returnError({
          success: false,
          message: `Failed to get attendance data: ${attendanceData.message}`,
          code: 500
        });
      }

      const attendance = attendanceData.data;
      const basicSalary = employee.salary || 0;
      let overtimeAmount = 0;
      let deductions = [];
      let remarks = [];

      // Calculate attendance-based salary components
      let totalWorkingDays = 0;
      let totalPresentDays = 0;
      let totalAbsentDays = 0;
      let totalLateDays = 0;
      let totalHalfDays = 0;
      let totalLeaveDays = 0;
      let totalHolidayDays = 0;
      let totalWeekendDays = 0;
      let totalOvertimeHours = 0;
      let totalLateHours = 0;

      // Process each day's attendance
      for (const dayAttendance of attendance.dailyAttendance) {
        const status = dayAttendance.attendanceStatus;
        const workingHours = dayAttendance.workingHours || 0;
        const overTime = dayAttendance.overTime || 0;
        const checkInTime = dayAttendance.checkInTime;
        const checkOutTime = dayAttendance.checkOutTime;

        totalWorkingDays++;

        switch (status) {
          case 'present':
            totalPresentDays++;
            // Calculate overtime if working hours > 9
            if (workingHours > DAILY_DUTY_HOURS) {
              const overtimeHours = workingHours - DAILY_DUTY_HOURS;
              totalOvertimeHours += overtimeHours;
              overtimeAmount += overtimeHours * HOURLY_RATE * OVERTIME_RATE;
            }
            // Check for late arrival (assuming 9 AM is standard start time)
            if (checkInTime) {
              const checkInHour = new Date(checkInTime).getHours();
              if (checkInHour > 9) {
                totalLateDays++;
                const lateHours = checkInHour - 9;
                totalLateHours += lateHours;
                const lateDeduction = lateHours * HOURLY_RATE * LATE_DEDUCTION_RATE;
                deductions.push({
                  date: dayAttendance.date,
                  reason: `Late arrival by ${lateHours} hours`,
                  amount: lateDeduction
                });
              }
            }
            break;

          case 'late':
            totalLateDays++;
            totalPresentDays++;
            // Calculate late deduction
            if (workingHours > 0) {
              const lateDeduction = workingHours * HOURLY_RATE * LATE_DEDUCTION_RATE;
              deductions.push({
                date: dayAttendance.date,
                reason: 'Late arrival',
                amount: lateDeduction
              });
            }
            break;

          case 'half-day':
            totalHalfDays++;
            totalPresentDays++;
            // Half day deduction
            const halfDayDeduction = DAILY_DUTY_HOURS * HOURLY_RATE * HALF_DAY_DEDUCTION_RATE;
            deductions.push({
              date: dayAttendance.date,
              reason: 'Half day',
              amount: halfDayDeduction
            });
            break;

          case 'absent':
            totalAbsentDays++;
            // Full day deduction
            const absentDeduction = DAILY_DUTY_HOURS * HOURLY_RATE * ABSENT_DEDUCTION_RATE;
            deductions.push({
              date: dayAttendance.date,
              reason: 'Absent',
              amount: absentDeduction
            });
            break;

          case 'leave':
            totalLeaveDays++;
            // No deduction for approved leave
            break;

          case 'holiday':
            totalHolidayDays++;
            // Holiday pay if employee worked
            if (workingHours > 0) {
              overtimeAmount += workingHours * HOURLY_RATE * HOLIDAY_PAY_RATE;
            }
            break;

          case 'weekend':
            totalWeekendDays++;
            // Weekend pay if employee worked
            if (workingHours > 0) {
              overtimeAmount += workingHours * HOURLY_RATE * WEEKEND_PAY_RATE;
            }
            break;
        }
      }

      // Calculate loan deductions
      // const loanDeductions = await this.calculateLoanDeductions(employee.employeeId, month, year, userID);
      // deductions.push(...loanDeductions);

      // Calculate expense deductions
      const expenseDeductions = await this.calculateExpenseDeductions(employee.employeeId, month, year, userID);
      deductions.push(...expenseDeductions);

      // Calculate total deductions
      const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

      // Calculate gross and net salary
      const grossSalary = basicSalary + overtimeAmount;
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      // Generate remarks
      remarks.push(`Month: ${month}/${year} (${daysInMonth} days), Working Days: ${totalWorkingDays}, Present: ${totalPresentDays}, Absent: ${totalAbsentDays}`);
      remarks.push(`Late Days: ${totalLateDays}, Half Days: ${totalHalfDays}, Leave Days: ${totalLeaveDays}`);
      remarks.push(`Overtime Hours: ${totalOvertimeHours.toFixed(2)}, Holiday Days: ${totalHolidayDays}, Weekend Days: ${totalWeekendDays}`);
      remarks.push(`Hourly Rate: ${HOURLY_RATE.toFixed(2)}, Total Deductions: ${totalDeductions.toFixed(2)}, Net Salary: ${netSalary.toFixed(2)}`);

      return returnSuccess({
        success: true,
        message: 'Salary calculated successfully',
        data: {
          basicSalary,
          overtimeAmount,
          deductions,
          grossSalary,
          netSalary,
          remarks: remarks.join('; '),
          attendanceSummary: {
            daysInMonth,
            totalWorkingDays,
            totalPresentDays,
            totalAbsentDays,
            totalLateDays,
            totalHalfDays,
            totalLeaveDays,
            totalHolidayDays,
            totalWeekendDays,
            totalOvertimeHours,
            totalLateHours,
            hourlyRate: HOURLY_RATE
          }
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: `Failed to calculate salary: ${error.message}`,
        code: 500
      });
    }
  }

  static async getEmployeeMonthlyAttendance(params) {
    try {
      const { employeeId, month, year, userID } = params;

      // Create start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      // Use aggregation pipeline to get employee's monthly attendance
      const monthlyAttendance = await AttendanceSchema.aggregate([
        // Stage 1: Match documents for the specific user and date range
        {
          $match: {
            userID: userID,
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        // Stage 2: Unwind the attendance array to work with individual employee records
        {
          $unwind: '$attendance'
        },
        // Stage 3: Match only the specific employee
        {
          $match: {
            'attendance.employeeId': employeeId
          }
        },
        // Stage 4: Project the required fields
        {
          $project: {
            _id: 0,
            attendanceId: 1,
            date: 1,
            day: 1,
            employeeId: '$attendance.employeeId',
            checkInTime: '$attendance.checkInTime',
            checkOutTime: '$attendance.checkOutTime',
            workingHours: '$attendance.workingHours',
            overTime: '$attendance.overTime',
            attendanceStatus: '$attendance.attendanceStatus',
            note: '$attendance.note'
          }
        },
        // Stage 5: Sort by date
        {
          $sort: { date: 1 }
        }
      ]);

      return returnSuccess({
        success: true,
        message: 'Employee monthly attendance retrieved successfully',
        data: {
          employeeId,
          month,
          year,
          dailyAttendance: monthlyAttendance
        }
      });
    } catch (error) {
      return returnError({
        success: false,
        message: `Failed to retrieve attendance: ${error.message}`,
        code: 500
      });
    }
  }

  static async calculateExpenseDeductions(employeeId, month, year, userID) {
    try {
      // Get employee expenses for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const expenses = await ExpenseSchema.find({
        employeeId,
        userID,
        catagory: 'employee',
        expenseDate: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const expenseDeductions = expenses.map(expense => ({
        date: expense.expenseDate,
        reason: `Employee expense: ${expense.description}`,
        amount: expense.amount
      }));

      return expenseDeductions;
    } catch (error) {
      console.error('Error calculating expense deductions:', error);
      return [];
    }
  }

  static async getSalaryHistoryOfAllEmployees(params) {
    try {
      const {
        userID,
        month,
        year,
        status,
      } = params;

      // Build query object
      const query = { userID };

      // Month and year filter
      if (month) {
        query.month = parseInt(month);
      }
      if (year) {
        query.year = parseInt(year);
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Build sort object
      const sort = {};
      sort['createdAt'] = 'desc';

      // Execute query and populate employee details
      const salaries = await SalarySchema.find(query).populate({
        path: 'employeeId',
        select: 'name email department position',
        localField: 'employeeId',
        foreignField: 'employeeId'
      })
        .sort(sort)

      return returnSuccess({
        success: true,
        message: 'Salary history retrieved successfully',
        data: salaries,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve salary history'));
    }
  }

  static async getSalaryHistoryOfAnEmployee(params) {
    try {
      const {
        userID,
        employeeId
      } = params;

      // Build query object
      const query = { 
        userID,
        employeeId: employeeId
      };

      // Build sort object
      const sort = {};
      sort['createdAt'] = 'desc';

      // Execute query and populate employee details
      const salaries = await SalarySchema.find(query)
        .sort(sort)

      return returnSuccess({
        success: true,
        message: 'Employee salary history retrieved successfully',
        data: salaries,

      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee salary history'));
    }
  }

  static async getSalaryDetail(params) {
    try {
      const { userID, salaryId } = params;

      const salary = await SalarySchema.findOne({ 
        salaryId: salaryId,
        userID: userID 
      }).populate('employeeId', 'name email department position phone address');

      if (!salary) {
        return returnError({
          success: false,
          message: 'Salary not found',
          code: 404
        });
      }

      return returnSuccess({
        success: true,
        message: 'Salary details retrieved successfully',
        data: salary,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve salary details'));
    }
  }

  static async update(salaryId, data) {
    const salary = await SalarySchema.findOneAndUpdate(
      { salaryId: salaryId }, 
      data, 
      { new: true }
    ).populate('employeeId', 'name email department position');
    
    if (!salary) {
      return returnError(errorDB('Salary not updated'));
    }
    return returnSuccess({
      success: true,
      message: 'Salary updated successfully',
      data: salary,
    });
  }

  static async updateStatus(salaryId, status, paymentDate = null) {
 
    const salary = await SalarySchema.findOneAndUpdate(
      { salaryId: salaryId }, 
      { status: status, paymentDate: paymentDate }, 
      { new: true }
    )
    if (!salary) {
      return returnError(errorDB('Salary status not updated'));
    }
    return returnSuccess({
      success: true,
      message: 'Salary status updated successfully',
      data: salary,
    });
  }

  static async calculateLoanDeductions(employeeId, month, year, userID) {
    try {
      const deductions = [];
      
      // Get all active loans for this employee
      const activeLoans = await LoanSchema.find({
        employeeId: employeeId,
        userID: userID,
        status: { $in: ['active', 'approved'] }
      });

      for (const loan of activeLoans) {
        // Find the installment for this month
        const installment = loan.installments.find(inst => {
          const instDate = new Date(inst.dueDate);
          return instDate.getMonth() + 1 === month && 
                 instDate.getFullYear() === year && 
                 inst.status === 'pending';
        });

        if (installment) {
          deductions.push({
            date: new Date(year, month - 1, 1), // First day of the month
            reason: `Loan Installment - ${loan.loanType} loan (${loan.loanId})`,
            amount: installment.amount,
            loanId: loan.loanId,
            installmentNumber: installment.installmentNumber
          });
        }
      }

      return deductions;
    } catch (error) {
      console.error('Error calculating loan deductions:', error);
      return [];
    }
  }

  static async processLoanDeductions(salaryId, userID) {
    try {
      const salary = await SalarySchema.findOne({ salaryId: salaryId, userID: userID });
      if (!salary) {
        return returnError({
          success: false,
          message: 'Salary not found',
          code: 404
        });
      }

      // Find loan deductions in the salary
      const loanDeductions = salary.deduction.filter(deduction => 
        deduction.reason && deduction.reason.includes('Loan Installment')
      );

      for (const deduction of loanDeductions) {
        if (deduction.loanId && deduction.installmentNumber) {
          // Update the loan installment as paid
          await LoanSchema.updateOne(
            { 
              loanId: deduction.loanId,
              'installments.installmentNumber': deduction.installmentNumber 
            },
            {
              $set: {
                'installments.$.paidAmount': deduction.amount,
                'installments.$.paidDate': new Date(),
                'installments.$.status': 'paid',
                'installments.$.remarks': 'Deducted from salary'
              }
            }
          );

          // Update loan totals
          const loan = await LoanSchema.findOne({ loanId: deduction.loanId });
          if (loan) {
            const paidInstallments = loan.installments.filter(inst => inst.status === 'paid').length;
            const remainingAmount = loan.totalAmount - (paidInstallments * loan.installmentAmount);
            
            await LoanSchema.updateOne(
              { loanId: deduction.loanId },
              {
                $set: {
                  paidInstallments: paidInstallments,
                  remainingAmount: remainingAmount,
                  status: paidInstallments === loan.totalInstallments ? 'completed' : 'active'
                }
              }
            );
          }
        }
      }

      return returnSuccess({
        success: true,
        message: 'Loan deductions processed successfully',
        data: null
      });
    } catch (error) {
      return returnError(errorDB('Failed to process loan deductions'));
    }
  }

  // Helper function to get the actual number of days in a specific month
  static getDaysInMonth(month, year) {
    // month is 1-indexed (1-12), so we use month to get the last day of the month
    return new Date(year, month, 0).getDate();
  }
}

module.exports = Salary; 