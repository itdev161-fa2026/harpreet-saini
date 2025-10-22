import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDatabase;

