const { Schema, model } = require('mongoose');

// Define Attendance schema
exports.Attendance = model(
  'attendance',
  new Schema(
    {
      attendanceId: {
        type: String,
        required: true,
        unique: true,
      },
      date: {
        type: Date,
        required: true,
        index: true,
      },
      day: {
        type: String,
        required: false,
      },
      attendance: [
        {
          employeeId: {
            type: String,
            required: true,
            ref: 'employee',
          },
          checkInTime: {
            type: Date,
            default: null,
          },
          checkOutTime: {
            type: Date,
            default: null,
          },
          workingHours: {
            type: Number,
            default: 0, // in hours
          },
          overTime: {
            type: Number,
            default: 0, // in hours
          },
          attendanceStatus: {
            type: String,
            enum: ['present', 'absent', 'late', 'half-day', 'leave', 'holiday', 'weekend'],
            default: 'present',
          },
          note: {
            type: String,
            default: '',
          },
        },
      ],
      userID: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  )
); 