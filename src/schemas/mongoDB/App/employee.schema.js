const { Schema, model } = require('mongoose');

// Define Employee schema
exports.Employee = model(
  'employee',
  new Schema(
    {
      employeeId: {
        type: String,
        require: true,
        unique: true,
      },
      userID: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      address2: {
        type: String,
      },
      age: {
        type: Number,
      },
      cnic: {
        type: String,
      },
      cast: {
        type: String,
      },
      department: {
        type: String,
      },
      position: {
        type: String,
      },
      joinDate: {
        type: String,
      },
      salary: {
        type: Number,
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'terminated'],
        default: 'active',
      },
      study: {
        type: String,
      },
      profilePic: {
        type: String,
      },
      bankAccount: {
        type: String,
      },
      emergencyContacts: [
        {
          name: {
            type: String,
          },
          phone: {
            type: String,
          },
          relation: {
            type: String,
          },
          occupation: {
            type: String,
          },
        },
      ],
      experiences: [
        {
          title: {
            type: String,
          },
          description: {
            type: String,
          },
          address: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      ],
      documents: [
        {
          name: {
            type: String,
          },
          file: {
            type: String,
          },
          type: {
            type: String,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields to the Employee schema
    }
  )
);
