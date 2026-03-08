import Note from "../models/Note.js";
import { encryptText, decryptText } from "../utils/encryption.js";

export const encryptNote = async (req, res) => {
  try {
    const { noteId, key } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.encrypted) {
      return res.status(400).json({ message: "Note already encrypted" });
    }

    const encryptedContent = encryptText(note.content, key);

    note.content = encryptedContent;
    note.encrypted = true;

    await note.save();

    res.json({
      success: true,
      message: "Note encrypted successfully"
    });

  } catch (error) {
    console.log("ENCRYPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Decrypt note function
export const decryptNote = async (req, res) => {
  try {
    const { noteId, key } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.encrypted) {
      return res.status(400).json({ message: "Note is not encrypted" });
    }

    const decryptedContent = decryptText(note.content, key);

    if (!decryptedContent) {
      return res.status(400).json({ message: "Wrong key" });
    }

    note.content = decryptedContent;
    note.encrypted = false;

    await note.save();

    res.json({
      success: true,
      message: "Note decrypted",
      content: decryptedContent
    });

  } catch (error) {
    console.log("DECRYPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// create note function
export const createNote = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const newNote = new Note({
      title,
      content,
      userId
    });

    await newNote.save();

    res.status(201).json({
      success: true,
      note: newNote
    });

  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ userId });

    res.status(200).json(notes);

  } catch (error) {
    console.error("GET NOTES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};