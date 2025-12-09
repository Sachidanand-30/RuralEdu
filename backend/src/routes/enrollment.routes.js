// src/routes/enrollment.routes.js
import express from "express";
import {
  enrollCourse,
  getMyCourses
} from "../controllers/enrollment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { studentOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student: enroll in a course
router.post(
  "/enroll/:courseId",
  authMiddleware,
  studentOnly,
  enrollCourse
);

// Student: my enrolled courses
router.get(
  "/my-courses",
  authMiddleware,
  studentOnly,
  getMyCourses
);

export default router;
