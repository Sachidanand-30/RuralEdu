// src/middlewares/role.middleware.js
import { ROLES } from "../constants/roles.js";

export const studentOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.STUDENT) {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
  next();
};

export const educatorOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.EDUCATOR) {
    return res.status(403).json({ message: "Access denied: Educators only" });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
