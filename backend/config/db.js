const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDb is not connected");

    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
