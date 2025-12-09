import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;

  const exists = await Enrollment.findOne({
    student: req.user.id,
    course: courseId
  });

  if (exists) return res.status(400).json({ message: "Already enrolled" });

  await Enrollment.create({
    student: req.user.id,
    course: courseId,
    completedLessons: []
  });

  await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });

  res.json({ message: "course enrolled successfully" });
};

export const getMyCourses = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate("course");

  res.json(enrollments);
};
