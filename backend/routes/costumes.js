import express from "express";
import { readFile } from 'fs/promises';

const router = express.Router();

async function loadCostumes(){
  const raw = await readFile(new URL('../../data/products.json', import.meta.url));
  return JSON.parse(raw.toString());
}

router.get('/', async (req,res)=>{
  const q = (req.query.q||"").toLowerCase();
  const costumes = await loadCostumes();
  const list = q ? costumes.filter(c=> (c.name||"").toLowerCase().includes(q)) : costumes;
  res.json(list);
});

router.get('/:id', async (req,res)=>{
  const id = Number(req.params.id);
  const costumes = await loadCostumes();
  const item = costumes.find(c=>c.id===id);
  if(!item) return res.status(404).json({message:"Not found"});
  res.json(item);
});

export default router;