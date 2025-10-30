import express from "express";
import Reservation from "../models/reservationModel.js";
import { readFile } from "fs/promises";

const router = express.Router();

function overlaps(aFrom, aTo, bFrom, bTo) {
  const A1 = +new Date(aFrom),
    A2 = +new Date(aTo),
    B1 = +new Date(bFrom),
    B2 = +new Date(bTo);
  return !(A2 <= B1 || A1 >= B2);
}

async function loadCostumes() {
  const raw = await readFile(new URL("../../data/products.json", import.meta.url));
  return JSON.parse(raw.toString());
}

// Gauti visas rezervacijas
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("user", "email");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sukurti naują rezervaciją
router.post("/", async (req, res) => {
  const { costumeId, from, to, size = "M", user } = req.body || {};

  if (!costumeId || !from || !to || !user) {
    return res.status(400).json({ message: "Trūksta privalomų laukų." });
  }

  try {
    const costumes = await loadCostumes();
    const item = costumes.find((c) => c.id === Number(costumeId));
    if (!item) return res.status(404).json({ message: "Kostiumas nerastas." });

    // Patikrinti ar nėra datos konflikto
    const existing = await Reservation.find({ costumeId });
    const conflict = existing.some((r) => overlaps(from, to, r.from, r.to) && r.status !== "cancelled");
    if (conflict) return res.status(409).json({ message: "Datos jau užimtos." });

    const days = Math.ceil((+new Date(to) - +new Date(from)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return res.status(400).json({ message: "Netinkamos datos." });

    const total = days * (item.rentalPrice ?? item.price ?? 0);

    const newRes = await Reservation.create({
      user,
      costumeId: Number(costumeId),
      from,
      to,
      size,
      total,
      status: "pending",
    });

    res.status(201).json(newRes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Nepavyko sukurti rezervacijos." });
  }
});

// Pašalinti rezervaciją
router.delete("/:id", async (req, res) => {
  try {
    const result = await Reservation.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Rezervacija nerasta." });
    res.json({ message: "Rezervacija pašalinta." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
