const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fileValidationService = require("../utils/FileValidationService");

// Define the relative path from the root of your Node process
const uploadDir = "uploads/gallery/";

// Bulletproof check: If Docker mounts an empty volume, instantly create the folder
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Reuse the variable so we never have a typo
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Generates: 169119807-123456789.png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const validation = fileValidationService.validateMimeType(file.mimetype);
  if (validation.isValid) {
    cb(null, true);
  } else {
    cb(new Error(validation.error), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum
  fileFilter,
});

module.exports = upload;