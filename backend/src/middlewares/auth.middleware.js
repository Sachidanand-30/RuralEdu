// src/middlewares/auth.middleware.js
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];
   console.log("COOKIE RECEIVED:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      role: payload.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
