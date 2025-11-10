import express from "express";
import Question from "../models/Question.js";
/*import nodemailer from "nodemailer";*/

const router = express.Router();

// GET viešiems FAQ (tik public = true)
router.get("/public", async (req, res) => {
  try {
    const qs = await Question.find({ public: true });
    res.json(qs);
  } catch (err) {
    console.error("GET public questions error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET visiems klausimams (adminui)
router.get("/", async (req, res) => {
  try {
    const qs = await Question.find();
    res.json(qs);
  } catch (err) {
    console.error("GET questions error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST naujas lankytojo klausimas
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

// PUT atsakyti į klausimą (admin)
router.put("/:id", async (req, res) => {
  const { answer, makePublic } = req.body; // makePublic = boolean

  if (!answer) return res.status(400).json({ error: "Atsakymas būtinas" });

  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: "Klausimas nerastas" });

    q.answer = answer;
    q.answered = true;
    if (makePublic) q.public = true; // admin gali padaryti klausimą viešą
    await q.save();

    // Siunčiam el. laišką lankytojui tik jei yra askedBy
    /*if (q.askedBy) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"FAQ Support" <${process.env.SMTP_USER}>`,
        to: q.askedBy,
        subject: "Jūsų klausimo atsakymas",
        text: `Jūsų klausimas: ${q.question}\n\nAtsakymas: ${q.answer}`,
      });
    }*/

    res.json(q);
  } catch (err) {
    console.error("PUT question error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
