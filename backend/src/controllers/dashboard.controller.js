// src/controllers/dashboard.controller.js
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course");

    const educators = await User.find({ role: "educator" }).select("name email");

    res.json({
      myCourses: enrollments.map((en) => en.course),
      educators
    });
  } catch (err) {
    next(err);
  }
};

export const getEducatorDashboard = async (req, res, next) => {
  try {
    const educatorId = req.user.id;

    const courses = await Course.find({ educator: educatorId });

    res.json({
      totalCourses: courses.length,
      courses
    });
  } catch (err) {
    next(err);
  }
};
