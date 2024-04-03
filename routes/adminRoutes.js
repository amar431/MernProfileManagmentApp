import express from "express";
import { activateAccountController, adminLoginController, adminRegisterController, deleteUserController, logout } from "../controllers/adminController.js";
import { body } from "express-validator";
import { getUsersController } from "../controllers/adminDashboardController.js";
import {  verifyAdminToken, verifyToken } from "../utils/verifyUser.js";
import { adminHomeController } from "../controllers/homeController.js";
import { adminUpdateUserController } from "../controllers/adminUpdateUserController.js";

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
      .withMessage("Invalid email address")
  ],adminRegisterController)

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
  adminLoginController
);

router.get("/login/activate/:activationToken", activateAccountController);

router.get('/users',verifyAdminToken, getUsersController);
router.put('/users', verifyAdminToken, adminUpdateUserController);
router.delete('/:userId',verifyAdminToken,deleteUserController)
router.get('/home',verifyToken,adminHomeController)
router.post("/logout", logout);


export default router;
