import express from "express";
import { adminLoginController, deleteUserController } from "../controllers/adminController.js";
import { body } from "express-validator";
import { getUsersController } from "../controllers/adminDashboardController.js";
import {  verifyAdminToken, verifyToken } from "../utils/verifyUser.js";
import { adminHomeController } from "../controllers/homeController.js";
import { adminUpdateUserController } from "../controllers/adminUpdateUserController.js";

const router = express.Router();

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

router.get('/users',verifyAdminToken, getUsersController);
router.put('/users', verifyAdminToken, adminUpdateUserController);
router.delete('/:userId',verifyAdminToken,deleteUserController)
router.get('/home',verifyToken,adminHomeController)

export default router;
