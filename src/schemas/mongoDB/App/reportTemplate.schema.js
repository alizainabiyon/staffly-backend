const { Schema, model } = require('mongoose');

// Define ReportTemplate schema
exports.ReportTemplate = model(
  'reportTemplate',
  new Schema(
    {
      templateId: {
        type: String,
        required: true,
        unique: true,
      },
      templateType: {
        type: String,
        required: true,
        trim: true,
      },
      customUrl: {
        type: String,
      },
      defaultUrl: {
        type: String,
        required: true,
        trim: true,
      },
      userID: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  )
);
