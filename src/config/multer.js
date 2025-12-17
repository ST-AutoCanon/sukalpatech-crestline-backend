// src/config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Define folders
const UPLOADS_FOLDER = path.join(process.cwd(), "uploads");
const ATTACHMENTS_FOLDER = path.join(UPLOADS_FOLDER, "attachments");

// Ensure folders exist
[UPLOADS_FOLDER, ATTACHMENTS_FOLDER].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// -----------------------------
// Local storage configuration
// -----------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ATTACHMENTS_FOLDER);
  },
  filename: function (req, file, cb) {
    // Example: 1705123456789-123456789.pdf
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// -----------------------------
// File filter (optional)
// -----------------------------
const fileFilter = (req, file, cb) => {
  // Accept only pdf, images, or doc files (adjust as needed)
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, JPG, PNG files are allowed"));
  }
};

// -----------------------------
// Multer upload instance
// -----------------------------
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
