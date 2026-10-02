const { Schema, model } = require('mongoose');

// Define Invoice schema
exports.VendorOrder = model(
  'vendorOrder',
  new Schema(
    {
      orderId: {
        type: String,
        required: true,
        unique: true,
      },
      orderNumber: {
        type: String,
        required: true,
        unique: true,
      },
      userID: {
        type: String,
        required: true,
      },
      vendorId: {
        type: String,
        ref: 'vendor',
      },
      invoiceId: {
        type: String,
        ref: 'invoice',
        default: null,
      },
      description: {
        type: String,
        default: '',
      },
      items: [
        {
          description: {
            type: String,
            trim: true,
            default: '',
          },
          width: {
            type: Number,
            required: true,
            min: 0,
          },
          height: {
            type: Number,
            required: true,
            min: 0,
          },
          size: {
            type: Number,
            required: true,
            min: 0,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          },
          unitPrice: {
            type: Number,
            required: true,
            min: 0,
          },
          total: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      previousRemainingAmount: {
        type: Number,
        min: 0,
      },
      terms: {
        type: String,
        trim: true,
        default: '',
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'approved',
      },
      notes: {
        type: String,
        trim: true,
        default: '',
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      completedAt: {
        type: Date,
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
      createdBy: {
        type: String,
        required: true,
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