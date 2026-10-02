const { Schema, model } = require('mongoose');

// Define Invoice schema
exports.Invoice = model(
  'invoice',
  new Schema(
    {
      invoiceId: {
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
        required: true,
        ref: 'customer',
      },
      invoiceNumber: {
        type: String,
        required: true,
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
            required: true,
          },
          type: {
            type: String,
            enum: ['total_size', 'length_width', 'fixed_amount', 'quantity_only'],
            required: true,
          },
          length: {
            type: Number,
            min: 0,
            default: 0,
          },
          width: {
            type: Number,
            min: 0,
            default: 0,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          },
          totalSize: {
            type: Number,
            min: 0,
            default: 0,
          },
          unitPrice: {
            type: Number,
            min: 0,
            default: 0,
          },
          fixedAmount: {
            type: Number,
            min: 0,
            default: 0,
          },
          total: {
            type: Number,
            min: 0,
            default: 0,
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
      advanceAmount: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: 'PKR',
        maxlength: 3,
      },
      terms: {
        type: String,
        trim: true,
        default: '',
      },
      notes: {
        type: String,
        trim: true,
        default: '',
      },
      status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'],
        default: 'draft',
      },
      attachments: [
        {
          name: {
            type: String,
          },
          file: {
            type: String,
          },
          type: {
            type: String,
            default: 'other',
          },
        },
      ],
      sentAt: {
        type: Date,
        default: null,
      },
      acceptedAt: {
        type: Date,
        default: null,
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      convertedToInvoice: {
        type: Boolean,
        default: false,
      },
      quotationId: {
        type: String,
        ref: 'quotation',
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