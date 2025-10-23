import express from 'express';
import { readFile } from 'fs/promises';

const router = express.Router();
let reservations = [];

function overlaps(aFrom,aTo,bFrom,bTo){
  const A1=+new Date(aFrom), A2=+new Date(aTo), B1=+new Date(bFrom), B2=+new Date(bTo);
  return !(A2<=B1 || A1>=B2);
}

async function loadCostumes(){
  const raw = await readFile(new URL('../../data/products.json', import.meta.url));
  return JSON.parse(raw.toString());
}

router.get('/', (_,res)=> res.json(reservations));

router.post('/', async (req,res)=>{
  const { costumeId, from, to, size="M", user="u1" } = req.body||{};
  if(!costumeId||!from||!to) return res.status(400).json({message:"costumeId/from/to required"});

  const costumes = await loadCostumes();
  const item = costumes.find(c=>c.id===Number(costumeId));
  if(!item) return res.status(404).json({message:"Costume not found"});

  const conflict = reservations.some(r=>r.costumeId===Number(costumeId) && overlaps(from,to,r.from,r.to) && r.status!=='cancelled');
  if(conflict) return res.status(409).json({message:"Dates not available"});

  const days = Math.ceil((+new Date(to) - +new Date(from)) / (1000*60*60*24));
  if(days<=0) return res.status(400).json({message:"Invalid dates"});
  const total = days * (item.rentalPrice ?? item.price ?? 0);

  const newRes = { id:`r${reservations.length+1}`, user, costumeId: Number(costumeId), from, to, size, total, status:"pending" };
  reservations.push(newRes);
  res.status(201).json(newRes);
});

export default router;
