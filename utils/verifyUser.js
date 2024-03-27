import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import userModel from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.Bearer;

  if (!token && req.params.token) {
    token = req.params.token;
  }
  console.log(token);
  if (!token) {
    return res.status(401).json({authenticated:false})
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user.role = user.role;

    if (user.role === "admin") {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }

    console.log(decode);
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdminToken = async (req, res, next) => {
  const token = req.cookies.AdminBearer;

  if (!token && req.params.token) {
    token = req.params.token;
  }
  
  if (!token) {
    console.log("no token")
    return res.status(401).json({authenticated:false})
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("before",user.role)
    req.user.role = user.role;
    console.log("after",user.role)

    if (user.role === "admin") {
      req.isAdmin = true;
      return next();
    } else {
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    next(error);
  }
};
