// src/routes/dashboard.routes.js
import express from "express";
import {
  getStudentDashboard,
  getEducatorDashboard
} from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { studentOnly, educatorOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student dashboard
router.get(
  "/student",
  authMiddleware,
  studentOnly,
  getStudentDashboard
);

// Educator dashboard
router.get(
  "/educator",
  authMiddleware,
  educatorOnly,
  getEducatorDashboard
);

export default router;
