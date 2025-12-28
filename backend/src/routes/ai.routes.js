import express from "express";
import { solveDoubt } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/solve-doubt", solveDoubt);

export default router;
