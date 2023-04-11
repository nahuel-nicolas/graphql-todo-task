const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/graphql-todo-tasks');

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
