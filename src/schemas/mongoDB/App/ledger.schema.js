const { Schema, model } = require('mongoose');

// Define Ledger schema
const transactionSchema = new Schema({
  transactionId: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'PKR',
  },
  openingBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  closingBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentType: {
    type: String,
    enum: ['credit', 'debit'],
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank'],
    default: '',
  },
  senderType: {
    type: String,
    enum: ['customer', 'vendor', 'director', 'till'],
    default: '',
  },
  receiverType: {
    type: String,
    enum: ['customer', 'employee', 'office', 'vendor', 'director', 'till'],
    default: '',
  },
  customerId: {
    type: String,
    ref: 'customer',
  },
  vendorId: {
    type: String,
    ref: 'vendor',
  },
  directorId: {
    type: String,
    ref: 'director',
  },
  purpose: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

});

exports.Ledger = model(
  'ledger',
  new Schema(
    {
      ledgerId: {
        type: String,
        required: true,
        unique: true,
      },
      userID: {
        type: String,
        required: true,
        ref: 'user',
      },
      ledgerType: {
        type: String,
        enum: ['customer', 'vendor', 'director', 'till'],
        default: '',
      },
      customerId: {
        type: String,
        ref: 'customer',
      },
      vendorId: {
        type: String,
        ref: 'vendor',
      },
      directorId: {
        type: String,
        ref: 'director',
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
      },
      transactions: {
        type: [transactionSchema],
        default: [],
      },
      createdBy: {
        type: String,
        ref: 'user',
      },
      updatedBy: {
        type: String,
        ref: 'user',
        default: null,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
); 