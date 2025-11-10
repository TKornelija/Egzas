import { Router } from "express";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser.js";

const router = Router();

// POST /api/admin/auth/seed — сделай один раз, потом SEED_ADMIN выключи
router.post("/seed", async (req, res) => {
  try {
    if (process.env.SEED_ADMIN !== "true") return res.status(404).end();

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email/password required" });

    const exists = await AdminUser.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Admin already exists" });

    const u = new AdminUser({ email: email.toLowerCase(), role: "superadmin" });
    await u.setPassword(password);
    await u.save();

    res.json({ ok: true, id: u._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "seed failed" });
  }
});

// POST /api/admin/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await AdminUser.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role, scope: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "login failed" });
  }
});

export default router;
