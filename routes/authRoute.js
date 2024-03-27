import express from "express";
import { body, validationResult } from "express-validator";
import {
  activateAccountController,
  forgetPassword,
  loginController,
  logout,
  registerController,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateProfileController } from "../controllers/profileController.js";
import { homeController } from "../controllers/homeController.js";
import { verifyUser } from "../utils/paramToken.js";
import { verifyController } from "../controllers/verifyController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("firstname").notEmpty().withMessage("First name is required"),
    body("lastname").notEmpty().withMessage("Last name is required"),
    body("email")
      .bail()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  registerController
);

router.get("/login/activate/:activationToken", activateAccountController);

router.post(
  "/login",
  [
    body("email")
      .bail()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginController
);

router.put("/profile", verifyToken, updateProfileController);

router.get("/home", verifyToken, homeController);

router.post(
  "/forgetPassword",
  [
    body("email")
      .bail()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email address"),
  ],
  forgetPassword
);

router.post(
  "/reset-password/:token",
  [
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  resetPassword
);

router.post("/logout", logout);

export default router;
