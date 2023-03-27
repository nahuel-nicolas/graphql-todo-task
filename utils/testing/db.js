const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect('mongodb://localhost:27017/test');

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
