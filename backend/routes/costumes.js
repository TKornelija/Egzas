import express from "express";
import Costume from "../models/Costume.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET all costumes
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const costumes = await Costume.find(filter);
    res.json(costumes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET costume by ID
router.get("/:id", async (req, res) => {
  try {
    const costume = await Costume.findOne({ id: Number(req.params.id) });
    if (!costume) return res.status(404).json({ message: "Not found" });
    res.json(costume);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET reviews for costume
router.get("/:id/reviews", async (req, res) => {
  try {
    const costumeId = Number(req.params.id);
    const reviews = await Review.find({ costumeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST review for costume
router.post("/:id/reviews", async (req, res) => {
  try {
    const costumeId = Number(req.params.id);
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const review = await Review.create({ costumeId, text });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;