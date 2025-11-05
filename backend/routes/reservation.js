import express from "express";
import Reservation from "../models/reservationModel.js";
import Costume from "../models/Costume.js";

const router = express.Router();


function overlaps(aFrom, aTo, bFrom, bTo) {
  const A1 = +new Date(aFrom);
  const A2 = +new Date(aTo);
  const B1 = +new Date(bFrom);
  const B2 = +new Date(bTo);
  return !(A2 <= B1 || A1 >= B2);
}


router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    console.error("Klaida GET /api/reservations:", err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { costumeId, from, to, size = "M" } = req.body || {};

    if (!costumeId || !from || !to) {
      return res.status(400).json({ message: "Trūksta privalomų laukų." });
    }


    const item = await Costume.findOne({ id: Number(costumeId) });
    if (!item) {
      console.log("Kostiumas nerastas MongoDB:", costumeId);
      return res.status(404).json({ message: "Kostiumas nerastas." });
    }


    const existing = await Reservation.find({ costumeId: Number(costumeId) });


    const overlapping = existing.filter((r) =>
      overlaps(from, to, r.from, r.to)
    );


    if (overlapping.length >= (item.quantity || 1)) {
      return res.status(409).json({
        message: `Šiuo laikotarpiu visi ${item.quantity} "${item.name}" kostiumai rezervuoti.`,
      });
    }


    const days = Math.ceil(
      (+new Date(to) - +new Date(from)) / (1000 * 60 * 60 * 24)
    );
    if (days <= 0) {
      return res.status(400).json({ message: "Netinkamos datos." });
    }

    const total = days * (item.rentalPrice ?? item.price ?? 0);


    const newRes = await Reservation.create({
      costumeId: Number(costumeId),
      from,
      to,
      size,
      total,
      status: "pending",
    });

    console.log("Nauja rezervacija sukurta:", newRes._id);
    res.status(201).json(newRes);
  } catch (err) {
    console.error("Klaida POST /api/reservations:", err);
    res.status(500).json({ message: "Nepavyko sukurti rezervacijos." });
  }
});


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
