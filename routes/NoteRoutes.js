import express from "express";
import { createNote, getUserNotes,encryptNote, decryptNote } from "../controllers/Note.js";
//import { createNote, updateNote } from "../controllers/Note.js";
const router = express.Router();

router.post("/create", createNote);
router.get("/:userId", getUserNotes);
router.post("/encrypt", encryptNote);
router.post("/decrypt", decryptNote);

export default router;