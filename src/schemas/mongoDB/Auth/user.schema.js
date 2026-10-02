const { Schema, model } = require('mongoose');

// Define User schema
exports.User = model(
  'user',
  new Schema(
    {
      userID: {
        type: String,
      },
      firstName: {
        type: String,
        default: null,
      },
      lastName: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      profilePicUrl: {
        type: String,
        default: null,
      },
      companyName: {
        type: String,
        default: null,
      },
      companyLogoUrl: {
        type: String,
        default: null,
      },
      companyAddress: {
        type: String,
        default: null,
      },
      companyPhone: {
        type: String,
        default: null,
      },
      companyEmail: {
        type: String,
        default: null,
      },
      companyWebsite: {
        type: String,
        default: null,
      },
      companyTaxNumber: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields to the User schema
    }
  )
);
