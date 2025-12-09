// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* ---------------------- GLOBAL MIDDLEWARES ---------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
  methods : ["GET","POST","PUT"]
}));
/* ---------------------- STATIC FILES ---------------------- */
// Enable access to uploaded assignment PDFs
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* ---------------------- ROUTES ---------------------- */

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "LMS backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ---------------------- ERROR HANDLER ---------------------- */
app.use(errorHandler);

export default app;
