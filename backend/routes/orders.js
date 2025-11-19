import express from 'express';
import Order from "../models/Orders.js";
import User from '../models/userModel.js';
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user._id,
      items: req.body.items || [],
      /*reservations: req.body.reservations || [],*/
      customer: req.body.customer || {},
      deliveryMethod: req.body.deliveryMethod,
      storeLocation: req.body.storeLocation || null,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
    });


    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nepavyko sukurti užsakymo" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

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
export default router;