const mongoose = require('mongoose');

module.exports.connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection established with MongoDB.');
    return;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};