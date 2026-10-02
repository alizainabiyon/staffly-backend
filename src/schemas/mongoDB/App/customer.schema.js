const { Schema, model } = require('mongoose');

// Define Customer schema
exports.Customer = model(
  'customer',
  new Schema(
    {
      customerId: {
        type: String,
        required: true,
        unique: true,
      },
      contractorId: {
        type: String,
      },
      // Basic Information
      name: {
        type: String,
        required: true,
      },
      company: {
        type: String,
      },
      customerType: {
        type: String,
      },
      
      // Contact Information
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      otherContactNo: {
        type: String,
      },
      website: {
        type: String,
      },
      
      // Address Information
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
        trim: true,
        default: '',
      },
      officeAddress: {
        type: String,
      },
      
      // Business Information
      taxNumber: {
        type: String,
        trim: true,
        default: '',
      },
      // Contact Person Details
      contactPerson: {
        type: String,
      },
      
      // Additional Information
      notes: {
        type: String, 
      },
      tags: [{
        type: String,
      }],
      
      // Status
      status: {
        type: String,
        enum: ['active', 'inactive', 'prospect', 'lead', 'suspended'],
        default: 'active',
      },
      
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