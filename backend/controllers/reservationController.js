import Reservation from "../models/reservationModel.js";

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "email") 
      .populate("costume", "name"); 
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReservation = async (req, res) => {
  const { user, costume, date } = req.body;

  try {
    const reservation = await Reservation.create({ user, costume, date });
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) return res.status(404).json({ error: "Rezervacija nerasta." });
    res.status(200).json({ message: "Rezervacija ištrinta." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!reservation) return res.status(404).json({ error: "Rezervacija nerasta." });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
