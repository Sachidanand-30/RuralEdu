import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
  path: "/"
};

const registerUser = async (req, res, role) => {
  try {
    const { name, email, password, grade } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (role === "student" && !grade) {
      return res.status(400).json({ message: "Grade is required for students" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });


    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      ...(role === "student" && { grade })
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .cookie("token", token, COOKIE_OPTIONS)
      .status(201)
      .json({
        message: `${role} registered successfully`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.grade && { grade: user.grade })
        }
      });

  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
    console.log(err)
  }
};

const loginUser = async (req, res, role) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email, role });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .cookie("token", token, COOKIE_OPTIONS)
      .json({
        message: `${role} login successful`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.grade && { grade: user.grade })
        }
      });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

// ---------------- STUDENT ----------------

export const registerStudent = (req, res) =>
  registerUser(req, res, "student");

export const loginStudent = (req, res) =>
  loginUser(req, res, "student");

// ---------------- EDUCATOR ----------------

export const registerEducator = (req, res) =>
  registerUser(req, res, "educator");

export const loginEducator = (req, res) =>
  loginUser(req, res, "educator");

// ---------------- LOGOUT ----------------

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS).json({
    message: "Logged out successfully"
  });
};
