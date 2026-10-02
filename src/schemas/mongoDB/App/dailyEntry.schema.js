const { Schema, model } = require('mongoose');

// Define Daily Entry schema
exports.DailyEntry = model(
  'dailyEntry',
  new Schema(
    {
      entryId: {
        type: String,
        required: true,
        unique: true,
      },
      entryNumber: {
        type: String,
        required: true,
        unique: true,
      },
      userID: {
        type: String,
        required: true,
      },
      contractorId: {
        type: String,
        ref: 'contractor',
      },
      customerId: {
        type: String,
        ref: 'customer',
      },
      vendorId: {
        type: String,
        ref: 'vendor',
      },
      employeeId: {
        type: String,
        ref: 'employee',
      },
      directorId: {
        type: String,
        ref: 'director',
      },
      entryDate: {
        type: Date,
        required: true,
      },
      expenseCategory: {
        type: String,
        enum: ['office', 'director', 'employee'],
      },
      expenseType: {
        type: String,
        enum: ['salary', 'site', 'grocery', 'kitchen', 'bills', 'expense', 'other'],
      },
      entryType: {
        type: String,
        enum: ['customer', 'vendor', 'employee', 'director', 'expense', 'other'],
        required: true,
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
      // Transaction Details
      purpose: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        default: '',
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        maxLength: 3,
        default: 'PKR',
      },

      // Source Information (Where money comes from)
      destinationType: {
        type: String,
        enum: ['till', 'director', 'vendor'],
        required: false,
      },
      destinationDirectorId: {
        type: String,
        ref: 'director',
      },
      destinationVendorId: {
        type: String,
        ref: 'vendor',
      },
      entryClearStatus: {
        type: String,
        enum: ['pending', 'cleared', 'rejected'],
        default: 'pending',
      },
      entryClearDate: {
        type: Date,
        default: null,
      },
      notes: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        enum: ['draft', 'completed'],
        default: 'draft',
      },

      // Metadata
      createdBy: {
        type: String,
        required: true,
      },
      updatedBy: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    }
  )
);

// Define Day Summary schema
exports.DaySummary = model(
  'daySummary',
  new Schema(
    {
      dayId: {
        type: String,
        required: true,
        unique: true,
      },
      contractorId: {
        type: String,
        required: true,
        ref: 'contractor',
      },

      // Day Information
      date: {
        type: Date,
        required: true,
      },
      dayNumber: {
        type: String,
        required: true,
      },

      // Status Information
      status: {
        type: String,
        enum: ['open', 'closed', 'reconciled'],
        default: 'open',
      },
      isClosed: {
        type: Boolean,
        default: false,
      },
      closedAt: {
        type: Date,
        default: null,
      },
      closedBy: {
        type: String,
        default: '',
      },

      // Entry Statistics
      totalEntries: {
        type: Number,
        default: 0,
      },
      draftEntries: {
        type: Number,
        default: 0,
      },
      processedEntries: {
        type: Number,
        default: 0,
      },
      failedEntries: {
        type: Number,
        default: 0,
      },

      // Financial Summary
      totalReceipts: {
        type: Number,
        default: 0,
      },
      totalPayments: {
        type: Number,
        default: 0,
      },
      totalTransfers: {
        type: Number,
        default: 0,
      },
      totalAdjustments: {
        type: Number,
        default: 0,
      },
      netAmount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        maxLength: 3,
        default: 'USD',
      },

      // Source/Destination Summary
      sourceSummary: {
        till: { type: Number, default: 0 },
        director: { type: Number, default: 0 },
        customer: { type: Number, default: 0 },
        vendor: { type: Number, default: 0 },
        employee: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
        cash: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
      destinationSummary: {
        till: { type: Number, default: 0 },
        director: { type: Number, default: 0 },
        customer: { type: Number, default: 0 },
        vendor: { type: Number, default: 0 },
        employee: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },
        cash: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },

      // Category Summary
      categorySummary: {
        order_payment: { type: Number, default: 0 },
        vendor_payment: { type: Number, default: 0 },
        employee_salary: { type: Number, default: 0 },
        director_expense: { type: Number, default: 0 },
        bill_payment: { type: Number, default: 0 },
        loan_payment: { type: Number, default: 0 },
        refund: { type: Number, default: 0 },
        adjustment: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },

      // Reconciliation Information
      isReconciled: {
        type: Boolean,
        default: false,
      },
      reconciledAt: {
        type: Date,
        default: null,
      },
      reconciledBy: {
        type: String,
        default: '',
      },
      reconciliationNotes: {
        type: String,
        trim: true,
        default: '',
      },

      // Notes
      notes: {
        type: String,
        maxLength: 1000,
        default: '',
      },

      // Metadata
      createdBy: {
        type: String,
        required: true,
      },
      updatedBy: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    }
  )
); 