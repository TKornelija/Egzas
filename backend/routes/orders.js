import express from 'express';
import { readFile } from 'fs/promises';

const router = express.Router();
let orders = [];

async function loadCostumes(){
  const raw = await readFile(new URL('../../data/products.json', import.meta.url));
  return JSON.parse(raw.toString());
}

router.get('/', (_,res)=> res.json(orders));

router.post('/', async (req,res)=>{
  const { costumeId, qty=1, size="M", user="u1" } = req.body||{};
  if(!costumeId) return res.status(400).json({message:"costumeId required"});

  const costumes = await loadCostumes();
  const item = costumes.find(c=>c.id===Number(costumeId));
  if(!item) return res.status(404).json({message:"Costume not found"});

  const q = Math.max(1, Number(qty)||1);
  const total = q * (item.price ?? 0);

  const order = {
    id: `o${orders.length+1}`,
    user,
    costumeId: Number(costumeId),
    size,
    qty: q,
    unitPrice: item.price ?? 0,
    total,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

export default router;
