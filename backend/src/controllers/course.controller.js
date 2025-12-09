import Course from "../models/Course.js";
import User from "../models/User.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, grade } = req.body;

    if (!grade) {
      return res.status(400).json({ message: "Grade is required for a course" });
    }

    const course = await Course.create({
      title,
      description,
      grade,
      educator: req.user.id
    });

    res.status(201).json({
      message: "course created successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
  }
};

export const getEducatorCourses = async (req, res) => {
  const courses = await Course.find({ educator: req.user.id });
  res.json(courses);
};

export const getCoursesByGrade = async (req, res) => {
  const { grade } = req.query;
  const filter = grade ? { grade } : {};
  const courses = await Course.find(filter).populate("educator", "name email");
  res.json(courses);
};

export const addLesson = async (req, res) => {
  const { title, youtubeUrl } = req.body;
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  course.lessons.push({ title, youtubeUrl });
  await course.save();

  res.json({ message: "Lesson added", course });
};

export const addAssignment = async (req, res) => {
  const { title, instructions } = req.body;
  const { courseId } = req.params;

  const pdfUrl = `/uploads/assignments/${req.file.filename}`;

  const course = await Course.findById(courseId);

  course.assignments.push({
    title,
    instructions,
    pdfUrl
  });

  await course.save();

  res.json({ message: "Assignment uploaded", course });
};

export const getAllEducators = async (req, res) => {
  const educators = await User.find({ role: "educator" }).select("name email");
  res.json(educators);
};

export const getEducatorCourseList = async (req, res) => {
  const courses = await Course.find({ educator: req.params.id });
  res.json(courses);
};

export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.courseId).populate("educator", "name email");
  res.json(course);
};
