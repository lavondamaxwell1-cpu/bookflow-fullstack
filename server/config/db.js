import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("your_mongodb")) {
      console.log("MongoDB connection skipped. Add your real MONGO_URI in .env");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
