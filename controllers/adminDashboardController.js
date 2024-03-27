// Import necessary modules
import userModel from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

// Controller to fetch all users
export const getUsersController = async (req, res, next) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    next(errorHandler(500, "Internal server error"));
  }
};
