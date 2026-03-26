import express from "express";
const router = express.Router();

import { summarizeNote } from "../controllers/Ai.js";

router.post("/summarize", summarizeNote);

export default router;