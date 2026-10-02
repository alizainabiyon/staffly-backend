const { Schema, model } = require('mongoose');

// Define Ledger schema
const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'PKR',
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentType: {
    type: String,
    enum: ['credit', 'debit'],
    default: 'debit',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank'],
    default: 'cash',
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  calculation: {
    type: {
      openingBalance: {
        type: Number,
        default: 0,
      },
      closingBalance: {
        type: Number,
        default: 0,
      },
      totalCash: {
        type: Number,
        default: 0,
      },
      totalBank: {
        type: Number,
        default: 0,
      }
    },
    default: {},
  }

});
exports.Expense = model(
  'expense',
  new Schema(
    {
      expenseId: {
        type: String,
        required: true,
        unique: true,
      },
      userID: {
        type: String,
        required: true,
      },
      expenseDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      catagory: {
        type: String,
        enum: ['office', 'director', 'employee'],
        required: true,
      },
      type: {
        type: String,
        enum: ['salary', 'site', 'grocery', 'kitchen', 'bills', 'expense', 'other'],
        required: true,
      },
      directorId: {
        type: String,
        ref: 'director',
      },
      employeeId: {
        type: String,
        ref: 'employee',
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    
      createdBy: {
        type: String,
        required: true,
      },
      updatedBy: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
); 