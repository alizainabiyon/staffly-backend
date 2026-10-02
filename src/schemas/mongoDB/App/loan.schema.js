const { Schema, model } = require('mongoose');

// Define Loan schema
exports.Loan = model(
  'loan',
  new Schema(
    {
      loanId: {
        type: String,
        required: true,
        unique: true,
      },
      employeeId: {
        type: String,
        required: true,
        ref: 'employee',
      },
      loanType: {
        type: String,
        enum: ['personal', 'home', 'vehicle', 'education', 'medical', 'other'],
        required: true,
      },
      loanAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      interestRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      totalAmount: {
        type: Number,
        min: 0,
      },
      installmentAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      totalInstallments: {
        type: Number,
        required: true,
        min: 1,
      },
      paidInstallments: {
        type: Number,
        default: 0,
        min: 0,
      },
      remainingAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      nextInstallmentDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'defaulted'],
        default: 'pending',
      },
      purpose: {
        type: String,
        required: true,
      },
      guarantor: {
        name: {
          type: String,
        },
        phone: {
          type: String,
          required: true,
        },
        relationship: {
          type: String
        },
      },
      documents: [
        {
          name: {
            type: String,
          },
          file: {
            type: String,
          },
        },
      ],
      installments: [
        {
          installmentNumber: {
            type: Number,
            required: true,
          },
          dueDate: {
            type: Date,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          paidAmount: {
            type: Number,
            default: 0,
          },
          paidDate: {
            type: Date,
            default: null,
          },
          status: {
            type: String,
            enum: ['pending', 'paid', 'overdue', 'partial'],
            default: 'pending',
          },
          remarks: {
            type: String,
            default: '',
          },
        },
      ],
      remarks: {
        type: String,
        default: '',
      },
      approvedBy: {
        type: String,
        default: null,
      },
      approvedAt: {
        type: Date,
        default: null,
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