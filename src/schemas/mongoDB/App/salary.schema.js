const { Schema, model } = require('mongoose');

// Define Salary schema
exports.Salary = model(
  'salary',
  new Schema(
    {
      salaryId: {
        type: String,
        required: true,
        unique: true,
      },
      employeeId: {
        type: String,
        required: true,
        ref: 'employee',
      },
      month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
        required: true,
        min: 2000,
        max: 2100,
      },
      basicSalary: {
        type: Number,
        required: true,
        min: 0,
      },
      overtimeAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      deduction: [
        {
          date: {
            type: Date,
            required: true,
          },
          reason: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
            min: 0,
          },
          loanId: {
            type: String,
            default: null,
          },
          installmentNumber: {
            type: Number,
            default: null,
          },
        },
      ],
      grossSalary: {
        type: Number,
        required: true,
        min: 0,
      },
      netSalary: {
        type: Number,
        required: true,
        min: 0,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'paid', 'cancelled'],
        default: 'pending',
      },
      paymentDate: {
        type: Date,
        default: null,
      },
      remarks: {
        type: String,
        default: '',
      },
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