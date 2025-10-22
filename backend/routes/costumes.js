import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();
const uri = "mongodb+srv://TOF:egzaminas2025@prekes.qewruix.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "prekes";

router.get("/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const costumes = db.collection("costumes");

    const costume = await costumes.findOne({ id: Number(req.params.id) });
    if (!costume) return res.status(404).json({ error: "Kostiumas nerastas" });

    res.json(costume);
  } catch (err) {
    console.error("Klaida:", err);
    res.status(500).json({ error: "Serverio klaida" });
  }
});

export default router;