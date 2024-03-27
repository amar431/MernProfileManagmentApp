// controllers/adminDashboardController.js

import User from "../models/userModel.js";

// Controller function to update user data
export const adminUpdateUserController = async (req, res) => {
  const { userId, ...updateData } = req.body; // Extract userId from request body
  // Validate if userId exists in the request body
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user by userId
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the received update data with the existing user data
    for (const key in updateData) {
      if (user[key] !== updateData[key]) {
        user[key] = updateData[key];
      }
    }

    // Save the updated user data
    user = await user.save();

    res.status(200).json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
