import express from "express";
import {
  addProfilePicture,
  deleteProfilePicture,
  getAllPictures,
  setPrimaryProfilePicture,
} from "../controllers/pictureController.js";
import { verifyToken } from "../utils/verifyUser.js";
import multer from "multer";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Specify the destination directory for uploads
  },
  filename: function (req, file, cb) {
    // Use original file name for uploaded file
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use(cors());

router.get("/pictures", verifyToken, getAllPictures);
router.post(
  "/pictures",
  verifyToken,
  upload.array("profilePictures", 3),
  addProfilePicture
);
router.put(
  "/pictures/:pictureId/set-primary",
  verifyToken,
  setPrimaryProfilePicture
);
router.delete("/pictures/:pictureId", verifyToken, deleteProfilePicture);

export default router;
