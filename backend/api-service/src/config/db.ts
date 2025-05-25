import mongoose from "mongoose";

export const connectToMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_DB_URI;
    if (!mongoUri) throw new Error("MONGO_DB_URI not found");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);  
  }
};
