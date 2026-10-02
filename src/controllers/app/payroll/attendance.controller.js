// @Dependencies
const { v4: uuid } = require('uuid');

// @Models
const AttendanceModel = require('../../../models/mongodb/app/Attendance.model');

// @Helper Functions
const { successResponse } = require('../../../utils/helperFunctions');

const attendance = {};

attendance.markAttendanceOfAllEmployees = async (req, res, next) => {
  let { date, day, attendance: attendanceRecords } = req.body;
  const { userID } = res.auth;

  try {
    const attendanceDto = {
      attendanceId: `attendence-${uuid()}`,
      date: new Date(date),
      day: day,
      attendance: attendanceRecords,
      userID
    };

    const { success, message, data } = await AttendanceModel.create(attendanceDto);

    return successResponse({
      res,
      code: 201,
      message: message,
      data: data,
    });
  } catch (e) {
    next(e);
  }
};
attendance.updateAttendanceOfAllEmployees = async (req, res, next) => {
  const { attendanceId, date, attendance: attendanceRecords } = req.body;
  try {
    const updatedAttendanceDto = {
      date: date ? new Date(date) : undefined,
      attendance: attendanceRecords,
    };

    const { success, message, data } = await AttendanceModel.update(attendanceId, updatedAttendanceDto);

    return successResponse({
      res,
      code: 200,
      message: 'Attendance updated successfully.',
      data: data,
    });
  } catch (e) {
    next(e);
  }
};
attendance.getOneDayAttendanceOfAllEmployees = async (req, res, next) => {
  const { userID } = res.auth;
  const { date } = req.query;

  try {
    const { success, message, data } = await AttendanceModel.getOneDayAttendance({ userID, date });

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
attendance.getAttendanceDetailOfOneEmployee = async (req, res, next) => {
  const { userID } = res.auth;
  const { attendanceId, employeeId } = req.query;

  try {
    const { success, message, data } = await AttendanceModel.getAttendanceDetailOfOneEmployee({
      userID,
      attendanceId,
      employeeId
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
attendance.getFullMonthAttendanceOfOneEmployee = async (req, res, next) => {
  const { userID } = res.auth;
  const { month, year, employeeId} = req.query;

  try {
    const { success, message, data } = await AttendanceModel.getFullMonthAttendance({
      userID,
      month,
      year,
      employeeId
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
attendance.getFullMonthAttendanceOfAllEmployee = async (req, res, next) => {
  const { userID } = res.auth;
  const { month, year } = req.query;

  try {
    const { success, message, data } = await AttendanceModel.getFullMonthAttendanceAllEmployees({
      userID,
      month,
      year
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
attendance.getAttendanceById = async (req, res, next) => {
  const { userID } = res.auth;
  const { attendanceId } = req.query;

  try {
    const { success, message, data } = await AttendanceModel.getAttendanceById({
      userID,
      attendanceId
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

attendance.deleteAttendance = async (req, res, next) => {
  const { userID } = res.auth;
  const { attendanceId } = req.query;

  try {
     await AttendanceModel.deleteOne({ attendanceId, userID });

    return successResponse({
      res,
      code: 200,
      message: 'Attendance deleted successfully',
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = attendance; 