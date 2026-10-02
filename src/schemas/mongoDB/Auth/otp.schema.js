const { Schema, model } = require('mongoose');

exports.Otp = model(
  'otp',
  new Schema(
    {
      otpID: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
      },
      otp: {
        type: Number,
        required: true,
      },
      otpExpire: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true }
  )
);
