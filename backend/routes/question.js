import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const qs = await Question.find({ public: true });
    res.json(qs);
  } catch (err) {
    console.error("GET public questions error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const qs = await Question.find().sort({ askedAt: -1 }); 
    res.json(qs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { question, askedBy } = req.body;
  if (!question) return res.status(400).json({ error: "Klausimas būtinas" });

  try {
    const q = new Question({ question, askedBy });
    const saved = await q.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Klaida išsaugant klausimą:", err);
    res.status(500).json({ error: "Nepavyko išsaugoti klausimo" });
  }
});

router.put("/:id", async (req, res) => {
  const { answer, makePublic } = req.body; 

  if (!answer) return res.status(400).json({ error: "Atsakymas būtinas" });

  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: "Klausimas nerastas" });

    q.answer = answer;
    q.answered = true;
     q.public = makePublic; 
    await q.save();

    res.json(q);
  } catch (err) {
    console.error("PUT question error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: "Klausimas nerastas" });

    res.json(q);
  } catch (err) {
    console.error("GET question by ID error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: "Klausimas nerastas" });
    res.json({ message: "Klausimas ištrintas" });
  } catch (err) {
    console.error("DELETE question error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
