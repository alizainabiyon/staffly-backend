const {
  Attendance: AttendanceSchema,
} = require('../../../schemas/mongoDB/App/attendance.schema');
const { Employee: EmployeeSchema } = require('../../../schemas/mongoDB/App/employee.schema');

// @Constants
const { errorCode: { RECORD_ALREADY_EXIST } } = require('../../../constants');

// @Helper Functions
const {
  returnSuccess,
  errorDB,
  returnError,
  errorResponse,
} = require('../../../utils/helperFunctions');

class Attendance extends AttendanceSchema {
  static async create(data) {
    const alreadyExitAttendance = await AttendanceSchema.findOne({ userID: data.userID, date: data.date });
    if (alreadyExitAttendance) {
      throw errorResponse(RECORD_ALREADY_EXIST);
    }
    const attendance = await AttendanceSchema.create(data);
    if (!attendance) {
      return returnError(errorDB('Attendance not created'));
    }
    return returnSuccess({
      success: true,
      message: 'Attendance created successfully',
      data: attendance,
    });
  }

  static async getOneDayAttendance(payload) {
    try {
      const { userID, date } = payload;

      // Execute query with pagination
      const attendance = await AttendanceSchema.find({ userID: userID, date: date })
        .populate({
          path: 'attendance.employeeId',
          select: 'employeeId name email phone department position',
          model: 'employee'
        });

      return returnSuccess({
        success: true,
        message: 'Attendance records retrieved successfully',
        data: attendance,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve attendance records'));
    }
  }

  static async getAttendanceById(payload) {
    try {
      const { userID, attendanceId } = payload;

      let attendance = await AttendanceSchema.findOne({
        attendanceId: attendanceId,
        userID: userID
      }).lean();

      if (!attendance) {
        return returnError(errorDB('Attendance record not found'));
      }
      let employeeIds = attendance.attendance.map(emp => emp.employeeId);
      let employees = await EmployeeSchema.find({ employeeId: { $in: employeeIds } }).select('employeeId name email phone department position').lean();
      let employeeMap = new Map(employees.map(emp => [emp.employeeId, emp]));
      attendance.attendance.forEach(emp => {
        emp.employee = employeeMap.get(emp.employeeId);
      });

      return returnSuccess({
        success: true,
        message: 'Attendance record retrieved successfully',
        data: attendance,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve attendance record'));
    }
  }

  static async getAttendanceDetailOfOneEmployee(payload) {
    try {
      const { userID, attendanceId, employeeId } = payload;

      const attendance = await AttendanceSchema.findOne({
        attendanceId: attendanceId,
        userID: userID,
        'attendance.employeeId': employeeId
      });

      if (!attendance) {
        return returnError(errorDB('Employee attendance record not found'));
      }

      // Filter to return only the specific employee's attendance data
      const employeeAttendance = attendance.attendance.find(emp => emp.employeeId === employeeId);
      
      if (!employeeAttendance) {
        return returnError(errorDB('Employee not found in attendance record'));
      }

      const result = {
        attendanceId: attendance.attendanceId,
        date: attendance.date,
        day: attendance.day,
        employeeAttendance: employeeAttendance
      };

      return returnSuccess({
        success: true,
        message: 'Employee attendance detail retrieved successfully',
        data: result,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee attendance detail'));
    }
  }

  static async update(attendanceId, data) {
    const attendance = await AttendanceSchema.findOneAndUpdate(
      { attendanceId: attendanceId },
      data,
      { new: true }
    );
    if (!attendance) {
      return returnError(errorDB('Attendance not updated'));
    }
    return returnSuccess({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    });
  }

  static async getFullMonthAttendance(payload) {
    try {
      const {
        userID,
        employeeId,
        month,
        year
      } = payload;

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

      // Calculate monthly summary statistics
      // const monthlySummary = {
      //   totalDays: monthlyAttendance.length,
      //   totalPresent: monthlyAttendance.filter(att => att.attendanceStatus === 'present').length,
      //   totalAbsent: monthlyAttendance.filter(att => att.attendanceStatus === 'absent').length,
      //   totalLate: monthlyAttendance.filter(att => att.attendanceStatus === 'late').length,
      //   totalHalfDay: monthlyAttendance.filter(att => att.attendanceStatus === 'half-day').length,
      //   totalLeave: monthlyAttendance.filter(att => att.attendanceStatus === 'leave').length,
      //   totalHoliday: monthlyAttendance.filter(att => att.attendanceStatus === 'holiday').length,
      //   totalWeekend: monthlyAttendance.filter(att => att.attendanceStatus === 'weekend').length,
      //   totalWorkingHours: monthlyAttendance.reduce((sum, att) => sum + (att.workingHours || 0), 0),
      //   totalOvertime: monthlyAttendance.reduce((sum, att) => sum + (att.overTime || 0), 0)
      // };

      return returnSuccess({
        success: true,
        message: 'Employee monthly attendance records retrieved successfully',
        data: {
          employeeId,
          month,
          year,
          dailyAttendance: monthlyAttendance,
          // monthlySummary
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee monthly attendance records'));
    }
  }
  static async getEmployeefullAttendance(payload) {
    try {
      const {
        userID,
        employeeId
      } = payload;

      // Use aggregation pipeline to get employee's monthly attendance
      const allAttendance = await AttendanceSchema.aggregate([
        // Stage 1: Match documents for the specific user and date range
        {
          $match: {
            userID: userID,
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
        message: 'Employee attendance records retrieved successfully',
        data: {
          employeeId,
          attendance: allAttendance,
        },
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve employee attendance records'));
    }
  }

  static async getFullMonthAttendanceAllEmployees(payload) {
    try {
      const { userID, month, year } = payload;

      // Date range filter for the entire month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Get all attendance records for the month
      const attendanceRecords = await AttendanceSchema.find({
        userID,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: 1 });

      // Process and format the data
      const monthlyAttendanceSummary = attendanceRecords.map(record => {
        // Calculate summary statistics for all employees for this day
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalOvertime = 0;
        let totalOnLeave = 0;
        let totalLate = 0;
        let totalHalfDay = 0;
        let totalHoliday = 0;
        let totalWeekend = 0;

        record.attendance.forEach(emp => {
          switch (emp.attendanceStatus) {
            case 'present':
              totalPresent++;
              break;
            case 'absent':
              totalAbsent++;
              break;
            case 'leave':
              totalOnLeave++;
              break;
            case 'late':
              totalLate++;
              break;
            case 'half-day':
              totalHalfDay++;
              break;
            case 'holiday':
              totalHoliday++;
              break;
            case 'weekend':
              totalWeekend++;
              break;
          }
          totalOvertime += emp.overTime || 0;
        });

        return {
          attendanceId: record.attendanceId,
          date: record.date,
          day: record.day,
          totalPresent,
          totalAbsent,
          totalOvertime: parseFloat(totalOvertime.toFixed(2)),
          totalOnLeave,
          totalLate,
          totalHalfDay,
          totalHoliday,
          totalWeekend,
          totalEmployees: record.attendance.length
        };
      });

      return returnSuccess({
        success: true,
        message: 'Monthly attendance summary retrieved successfully',
        data: monthlyAttendanceSummary,
      });
    } catch (error) {
      return returnError(errorDB('Failed to retrieve monthly attendance summary'));
    }
  }

  static async delete(attendanceId, userID) {
    try {
      const attendance = await AttendanceSchema.findOneAndDelete({
        attendanceId: attendanceId,
        userID: userID
      });

      if (!attendance) {
        return returnError(errorDB('Attendance record not found'));
      }

      return returnSuccess({
        success: true,
        message: 'Attendance deleted successfully',
        data: { attendanceId: attendance.attendanceId, date: attendance.date },
      });
    } catch (error) {
      return returnError(errorDB('Failed to delete attendance record'));
    }
  }
}

module.exports = Attendance; 