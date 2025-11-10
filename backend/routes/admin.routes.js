import express from 'express';
import jwt from 'jsonwebtoken';
import Costume from '../models/Costume.js';

const router = express.Router();

function adminAuth(req, res, next) {
  const a = req.headers.authorization || '';
  const m = a.match(/^Bearer\s+(.*)$/i);
  if (!m) return res.status(401).json({ error: 'Missing token' });
  const token = m[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.scope !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected admin routes
router.use(adminAuth);

// // GET /api/admin/costumes
// router.get('/costumes', async (req, res) => {
//   try {
//     const list = await Costume.find().lean();
//     res.json(list);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Failed to load costumes' });
//   }
// });

// // DELETE /api/admin/costumes/:id
// router.delete('/costumes/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     await Costume.findByIdAndDelete(id);
//     res.json({ ok: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Delete failed' });
//   }
// });

export default router;
