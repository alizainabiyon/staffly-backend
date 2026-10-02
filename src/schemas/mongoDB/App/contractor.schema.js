const { Schema, model } = require('mongoose');

// Define Contractor schema
exports.Contractor = model(
  'contractor',
  new Schema(
    {
      contractorId: {
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
      },
      type: {
        type: String,
        enum: ['individual', 'company', 'partnership', 'corporation'],
        default: 'individual',
      },
      category: {
        type: String,
        default: 'other',
      },

      // Contact Information
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      alternatePhone: {
        type: String,
        trim: true,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },

      // Address Information
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },

      industry: {
        type: String,
        trim: true,
        default: '',
      },
      specializations: [{
        type: String,
        trim: true,
      }],
      // Audit Fields
      createdBy: {
        type: String,
        required: true,
      },
      updatedBy: {
        type: String,
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