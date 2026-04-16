const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectMongo = async () => {
  try {
    // using in-memory mongodb server since mongodb isn't installed locally
    // this is fine for dev/testing - data resets on every server restart
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log("MongoDB (in-memory) connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
