const { Schema, model } = require('mongoose');

// Define Vendor schema
exports.Vendor = model(
  'vendor',
  new Schema(
    {
      vendorId: {
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
      companyName: {
        type: String,
        trim: true,
        default: '',
      },
      type: {
        type: String,
        enum: ['individual', 'company', 'organization'],
        default: 'company',
      },
      category: {
        type: String,
        enum: ['supplier', 'service_provider', 'manufacturer', 'distributor', 'wholesaler'],
        default: 'supplier',
      },

      // Contact Information
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
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
      website: {
        type: String,
        trim: true,
        default: '',
      },

      // Address Information
      address: {
        type: String,
        trim: true,
        default: '',
      },
      street: {
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

      status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'blacklisted'],
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