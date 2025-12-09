// src/config/multer.js
import multer from "multer";
import path from "path";

const assignmentsPath = "uploads/assignments";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assignmentsPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const uploadAssignment = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});
