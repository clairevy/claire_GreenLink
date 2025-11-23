import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
import {
  register,
  login,
  verifyEmailGet,
} from "../controllers/authControllers.js";

// Multer setup - store files in backend/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // store uploads in backend/uploads (project root /uploads)
    // __dirname is backend/src/routes -> go up two levels to project backend folder
    const uploadsPath = path.join(__dirname, "..", "..", "uploads");
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, unique + "-" + sanitized);
  },
});
const upload = multer({ storage });

// Accept single businessLicense and multiple images
// Dev-friendly GET to show this route exists (registration is a POST endpoint)
router.get("/register", (req, res) => {
  return res.json({
    message: "Register endpoint: use POST /api/auth/register with form data",
  });
});
router.post(
  "/register",
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "images", maxCount: 6 },
  ]),
  register
);
router.post("/login", login);
router.get("/verify-email", verifyEmailGet);
export default router;
