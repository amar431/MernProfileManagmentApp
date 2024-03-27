import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addAddress,
  deleteAddress,
  getAllAddress,
  setPrimaryAddress,
} from "../controllers/addressController.js";
const router = express.Router();

router.get("/addresses", verifyToken, getAllAddress);
router.post("/addresses", verifyToken, addAddress);
router.put("/:addressId/primary", verifyToken, setPrimaryAddress);
router.delete("/:addressId", verifyToken, deleteAddress);

export default router;
