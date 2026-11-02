import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/honda_tuning_shop';
  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Warning: MongoDB connection failed (${error.message}). Running in mock/offline mode.`);
  }
};
