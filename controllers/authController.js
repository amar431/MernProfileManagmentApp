import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { io } from "../index.js";



dotenv.config();

var transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const registerController = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let hashedPassword;
    let user;

    const { firstname, lastname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: "backendteam@yopmail.com",
        subject: "subject",
        html: `<h1>Error Details</h1>
                    <p>hashedPassword is down check hashing</p>`,
      });
    }

    const activationToken = uuidv4();
    let customToken = null;

    user = new userModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      activationToken,
      customToken,
      role: "user",
    });

    var mailOptions = {
      from: "batchuamarnathgupta1@gmail.com",
      to: user.email,
      subject: "Activate Your Account",
      html: `<p>Click <a href="http://localhost:3001/login/activate/${activationToken}">here</a> to activate your account.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      await user.save();
    } catch (emailError) {
      // If sending activation email fails, notify backend for further action
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: "backendteam@yopmail.com",
        subject: "subject",
        html: `<h1>Error Details</h1>
                        <p>Activation email failed to send. User data not saved.</p>`,
      });
      return res.status(500).json({
        message: "Internal server error. Please contact technical team.",
      });
    }

    res.status(201).send({
      success: true,
      message: "User registered successfully. Activation email sent.",
      user,
    });
  } catch (error) {
    console.log(error, "hi error");
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

export const loginController = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No User Found" });
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
    user.loggedIn = true;
    await user.save()

    const { password: pass, ...rest } = user._doc;
    res.cookie("Bearer", token).status(201).json(rest);

    io.emit('userStatusUpdate', { userId: user._id, status: true });
    console.log('User status update emitted:', {user, status: 'active' });
    } catch (error) {
    next(error);
  }
};

function generateToken(expirationSeconds) {
  const initializationTime = Date.now();
  const expirationTime = initializationTime + expirationSeconds * 1000; // Convert seconds to milliseconds
  const uid = uuidv4();

  // Construct the token string with the format: "uid:initializationTime:expirationTime"
  const token = `${uid}:${initializationTime}:${expirationTime}`;

  return token;
}

export const forgetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const token = generateToken(100); // 10 minutes expiration time
    if (!token) {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: "backendteam@yopmail.com",
        subject: "subject",
        text: `Error details: token is not working in forget password check it`,
      });
    }
    user.customToken = token;
    await user.save();

    var mailOptions = {
      from: "batchuamarnathgupta1@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:3001/reset-password/${token}">reset password</a>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send({
      success: true,
      message: "email sent.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Verify the token sent by the user
    const tokenParts = req.params.token.split(":");
    if (tokenParts.length !== 3) {
      return res.status(401).send({ message: "Invalid token format" });
    }

    const [uid, initializationTime, expirationTime] = tokenParts;

    const currentTimestamp = Date.now();
    if (currentTimestamp > Number(expirationTime)) {
      return res.status(401).send({ message: "Token has expired" });
    }

    const user = await userModel.findOne({ customToken: req.params.token });
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update user's password, clear reset token and expiration time
    user.password = req.body.newPassword;
    console.log(req.body.confirmPassword);
    user.customToken = null; // Clear the custom token
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
    res.status(500).send({ message: err.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    // Assuming you're storing the JWT token in a cookie named 'Bearer'
    res.clearCookie("Bearer"); // Clear the JWT token cookie
    const userId = req.body.userId; // Retrieve the user ID from the request body
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.loggedIn = false;
    await user.save();

    io.emit('userStatusUpdate',{userId, status: false })
    console.log('User status update emitted:', {user, status: 'inactive' });


    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
