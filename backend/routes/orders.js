import express from "express";
import Order from "../models/Orders.js";
import User from "../models/userModel.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user._id,
      items: req.body.items || [],
      customer: req.body.customer || {},
      deliveryMethod: req.body.deliveryMethod,
      storeLocation: req.body.storeLocation || null,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      status: req.body.status || "užsakymas pateiktas",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nepavyko sukurti užsakymo" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nepavyko gauti užsakymų" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const list = await Order.find()
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    res.json(list);
  } catch (err) {
    console.error("Failed to load orders:", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId");
    if (!order) {
      return res.status(404).json({ error: "Užsakymas nerastas" });
    }
    res.json(order);
  } catch (err) {
    console.error("Failed to load order:", err);
    res.status(500).json({ error: "Nepavyko gauti užsakymo" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "užsakymas pateiktas",
      "užsakymas atšauktas",
      "užsakymas išsiųstas",
      "užsakymas pristatytas",
      "užsakymas paruoštas atsiimti",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Netinkama užsakymo būsena" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId");

    if (!order) {
      return res.status(404).json({ error: "Užsakymas nerastas" });
    }

    res.json(order);
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).json({ error: "Nepavyko atnaujinti būsenos" });
  }
});

export default router;