const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log("✅ Connected to MongoDB successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    // process.on("SIGINT", async () => {
    //   await mongoose.connection.close();
    //   console.log("🔌 MongoDB connection closed due to app termination");
    //   process.exit(0);
    // });

    return true;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.log("⚠️ Server is running without database connection");
    return false;
  }
}

module.exports = connectDB;