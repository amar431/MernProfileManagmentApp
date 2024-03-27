import userModel from "./models/userModel.js";
import connectDB from './config/db.js'
import dotenv from 'dotenv'
dotenv.config()

connectDB()


async function updateExistingUsers() {
  try {
      await userModel.updateMany({}, { $set: { loggedIn: false } });
      console.log('All users updated successfully.');
  } catch (error) {
      console.error('Error updating users:', error);
  }
}

updateExistingUsers();