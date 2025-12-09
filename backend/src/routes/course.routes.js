// src/routes/course.routes.js
import express from "express";
import {
  createCourse,
  getEducatorCourses,
  addLesson,
  addAssignment,
  getAllEducators,
  getEducatorCourseList,
  getCourseById,
  getCoursesByGrade
} from "../controllers/course.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { educatorOnly } from "../middlewares/role.middleware.js";
import { uploadAssignment } from "../config/multer.js";

const router = express.Router();

// Educator: create course
router.post(
  "/create",
  authMiddleware,
  educatorOnly,
  createCourse
);

// Educator: add lesson (YouTube link)
router.post(
  "/:courseId/lessons",
  authMiddleware,
  educatorOnly,
  addLesson
);

// Educator: add assignment (PDF)
router.post(
  "/:courseId/assignments",
  authMiddleware,
  educatorOnly,
  uploadAssignment.single("pdf"),
  addAssignment
);

// Educator: list my courses
router.get(
  "/educator/my",
  authMiddleware,
  educatorOnly,
  getEducatorCourses
);

// Public: list all educators (for explore educators tab)
router.get("/educators", getAllEducators);

// Public: list courses filtered by grade (optional)
router.get("/", getCoursesByGrade);

// Public: get courses of a specific educator
router.get("/educator/:educatorId/courses", getEducatorCourseList);

// Public: get specific course details
router.get("/:courseId", getCourseById);

export default router;
