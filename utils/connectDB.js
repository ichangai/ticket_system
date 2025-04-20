import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL || '';

const connectDB = async () => {
  try {
   await mongoose.connect(dbUrl)
      .then(() => {
      console.log('MongoDB connected');
      }).catch((error) => {
        console.log(error.message);
      })
  } catch (error) {
    console.log(error.message)
    setTimeout(connectDB, 5000);
  }
}

export default connectDB;