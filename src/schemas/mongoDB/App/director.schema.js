const { Schema, model } = require('mongoose');

// Define Director schema
exports.Director = model(
  'director',
  new Schema(
    {
      directorId: {
        type: String,
        required: true,
        unique: true,
      },
      // Basic Information
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      alternatePhone: {
        type: String,
        trim: true,
        default: '',
      },

      // Address Information
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      // Status and Permissions
      status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'resigned'],
        default: 'active',
      },
      userID: {
        type: String,
        required: true,
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

// Define Director Expense schema
exports.DirectorExpense = model(
  'directorExpense',
  new Schema(
    {
      expenseId: {
        type: String,
        required: true,
        unique: true,
      },
      directorId: {
        type: String,
        required: true,
        ref: 'director',
      },
      contractorId: {
        type: String,
        required: true,
        ref: 'contractor',
      },

      // Expense Details
      title: {
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
        default: 'USD',
      },

      // Expense Classification
      category: {
        type: String,
        enum: [
          'home_bills', 'grocery', 'transportation', 'entertainment',
          'business_travel', 'office_supplies', 'utilities', 'maintenance',
          'insurance', 'healthcare', 'education', 'other'
        ],
        default: 'other',
      },
      subCategory: {
        type: String,
        trim: true,
        default: '',
      },

      // Payment Information
      paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'card', 'check', 'till'],
        default: 'cash',
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'rejected', 'cancelled'],
        default: 'pending',
      },

      // Approval Information
      approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      approvedBy: {
        type: String,
        default: '',
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      approvalNotes: {
        type: String,
        trim: true,
        default: '',
      },

      // Date Information
      expenseDate: {
        type: Date,
        required: true,
      },
      dueDate: {
        type: Date,
        default: null,
      },

      // Receipt and Documentation
      receipt: {
        type: String,
        default: '',
      },
      attachments: {
        type: [String],
        default: [],
      },

      // Tags and Classification
      tags: {
        type: [String],
        default: [],
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

// Define Director Payment schema
exports.DirectorPayment = model(
  'directorPayment',
  new Schema(
    {
      paymentId: {
        type: String,
        required: true,
        unique: true,
      },
      directorId: {
        type: String,
        required: true,
        ref: 'director',
      },
      contractorId: {
        type: String,
        required: true,
        ref: 'contractor',
      },

      // Payment Details
      title: {
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
        default: 'USD',
      },

      // Recipient Information
      recipientType: {
        type: String,
        enum: ['vendor', 'employee', 'customer', 'contractor', 'other'],
        required: true,
      },
      recipientId: {
        type: String,
        required: true,
      },
      recipientName: {
        type: String,
        required: true,
        trim: true,
      },

      // Payment Method
      paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'card', 'check', 'till'],
        default: 'cash',
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending',
      },

      // Approval Information
      approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      approvedBy: {
        type: String,
        default: '',
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      approvalNotes: {
        type: String,
        trim: true,
        default: '',
      },

      // Date Information
      paymentDate: {
        type: Date,
        required: true,
      },
      processedAt: {
        type: Date,
        default: null,
      },

      // Reference Information
      referenceNumber: {
        type: String,
        trim: true,
        default: '',
      },
      invoiceId: {
        type: String,
        default: '',
      },

      // Receipt and Documentation
      receipt: {
        type: String,
        default: '',
      },
      attachments: {
        type: [String],
        default: [],
      },

      // Tags and Classification
      tags: {
        type: [String],
        default: [],
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

// Define Office Till schema
exports.OfficeTill = model(
  'officeTill',
  new Schema(
    {
      tillId: {
        type: String,
        required: true,
        unique: true,
      },
      contractorId: {
        type: String,
        required: true,
        ref: 'contractor',
      },

      // Till Information
      name: {
        type: String,
        required: true,
        trim: true,
        default: 'Main Office Till',
      },
      location: {
        type: String,
        trim: true,
        default: 'Office',
      },

      // Financial Information
      currentBalance: {
        type: Number,
        default: 0,
      },
      openingBalance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        maxLength: 3,
        default: 'USD',
      },

      // Till Status
      status: {
        type: String,
        enum: ['active', 'inactive', 'closed'],
        default: 'active',
      },
      isDefault: {
        type: Boolean,
        default: true,
      },

      // Access Control
      authorizedUsers: {
        type: [String],
        default: [],
      },
      maxTransactionLimit: {
        type: Number,
        default: 0,
        min: 0,
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

// Define Till Transaction schema
exports.TillTransaction = model(
  'tillTransaction',
  new Schema(
    {
      transactionId: {
        type: String,
        required: true,
        unique: true,
      },
      tillId: {
        type: String,
        required: true,
        ref: 'officeTill',
      },
      contractorId: {
        type: String,
        required: true,
        ref: 'contractor',
      },

      // Transaction Details
      type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'payment', 'receipt'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        maxLength: 3,
        default: 'USD',
      },

      // Transaction Information
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        default: '',
      },

      // Related Information
      relatedTo: {
        type: String,
        enum: ['director', 'vendor', 'employee', 'customer', 'expense', 'payment', 'other'],
        default: 'other',
      },
      relatedId: {
        type: String,
        default: '',
      },
      relatedName: {
        type: String,
        trim: true,
        default: '',
      },

      // Balance Information
      balanceBefore: {
        type: Number,
        required: true,
      },
      balanceAfter: {
        type: Number,
        required: true,
      },

      // Transaction Details
      transactionDate: {
        type: Date,
        required: true,
      },
      referenceNumber: {
        type: String,
        trim: true,
        default: '',
      },

      // Receipt and Documentation
      receipt: {
        type: String,
        default: '',
      },
      attachments: {
        type: [String],
        default: [],
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