import express from "express";
import {
  registerStudent,
  registerEducator,
  loginStudent,
  loginEducator,
  logout
} from "../controllers/auth.controller.js";

const router = express.Router();

// Student
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

// Educator
router.post("/educator/register", registerEducator);
router.post("/educator/login", loginEducator);

// Logout
router.post("/logout", logout);

export default router;
