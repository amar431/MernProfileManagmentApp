// adminLoginController.js
import User from "../models/userModel.js";
import { hashPassword } from "../utils/authUtils.js";
import cryptoRandomString from 'crypto-random-string';
import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";
import { comparePassword } from "../utils/authUtils.js";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";


dotenv.config();
var transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

function generateToken(expirationSeconds) {
  const initializationTime = Date.now();
  const expirationTime = initializationTime + expirationSeconds * 1000; // Convert seconds to milliseconds
  const uid = uuidv4();

  // Construct the token string with the format: "uid:initializationTime:expirationTime"
  const token = `${uid}:${initializationTime}:${expirationTime}`;

  return token;
}
export const adminRegisterController = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { firstname, lastname, email, role } = req.body;

    // Generate a temporary password
    const temporaryPassword = cryptoRandomString({ length: 8, type: 'alphanumeric' });

    // Hash the temporary password
    const hashedTemporaryPassword = await hashPassword(temporaryPassword);

    // Generate activation token
    const activationToken = generateToken(100)

    // Create user with temporary password, specified role, and activation token
    const user = new userModel({
      firstname,
      lastname,
      email,
      password: hashedTemporaryPassword,
      role: role.toLowerCase(),
      temporaryPassword: hashedTemporaryPassword,
      activationToken,
    });

    let activationLink = `http://localhost:3001/login/activate/${activationToken}`; // Default for normal users
    if (role.toLowerCase() === 'admin') {
      activationLink = `http://localhost:3001/admin/login/activate/${activationToken}`;
    }

    // Send email with temporary password and activation link
    const mailOptions = {
      from: "batchuamarnathgupta1@gmail.com",
      to: user.email,
      subject: "Registration - Temporary Password and Activation Link",
      html: `<p>Hello ${firstname} ${lastname},</p>
      <p>Your email is: ${email}</p>
      <p>Your temporary password is: ${temporaryPassword}</p>
      <p>Please click <a href="${activationLink}">here</a> to activate your account.</p>
      <div style="margin-top: 20px; padding: 10px; background-color: #f2f2f2; border-radius: 5px;">
        <p style="margin-bottom: 10px;">Please note that this is your temporary password. For security reasons, we recommend that you <strong>reset your password immediately after logging in</strong> for the first time, on login page</p>
        <p>Kindly activate your account within 10 minutes, otherwise, the link will expire.</p>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Save the user to the database
    await user.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully. Temporary password and activation link sent via email.",
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    next(error);
  }
};

export const activateAccountController = async (req, res, next) => {
  try {
    const { activationToken } = req.params;
    const user = await userModel.findOne({ activationToken });

    if (!user) {
      return next(errorHandler(404, "Invalid activation token"));
    }

    user.active = true;
    user.activationToken = null;
    await user.save();

    res.status(200).send({
      success: true,
      message:
        "Account activated successfully. You can now log in to your account.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};





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

export const logout = async (req, res, next) => {
  try {
    // Assuming you're storing the JWT token in a cookie named 'Bearer'
    res.clearCookie("AdminBearer"); // Clear the JWT token cookie
    const userId = req.body.userId; // Retrieve the user ID from the request body
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.loggedIn = false;
    await user.save();

    

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

