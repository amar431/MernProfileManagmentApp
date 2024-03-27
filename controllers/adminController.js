// adminLoginController.js
import User from "../models/userModel.js";

import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import { comparePassword } from "../utils/authUtils.js";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
var transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const adminLoginController = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, role: "admin" });

    if (!user) {
      return res.status(404).json({ message: "No Admin Found" });
    }

    if (!user.active) {
      return res.status(403).json({
        message: "Account not activated. Please activate your account first.",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const payload = { id: user._id };
    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    if (!token) {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: "backendteam@yopmail.com",
        subject: "Subject",
        text: `<h1>Error Details</h1>
                     <p>token is not working in login check it</p>`,
      });
    }

    // Remove password from user object before sending response
    const { password: pass, ...rest } = user._doc;

    // Set token in cookie
    res.cookie("AdminBearer", token).status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

// controllers/adminDashboardController.js


// Controller function to delete a user by ID
export const deleteUserController = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
