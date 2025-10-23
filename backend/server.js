import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import connectDatabase from "./config/db.js";


const app = express();
app.use(cors());
app.use(express.json());

// Middleware
connectDatabase();

// --- health
app.get("/api/health", (_,res)=> res.json({ ok:true, service:"FreakOrTreat API" }));

// --- costumes
app.get("/api/costumes", (req,res)=>{
  const q = (req.query.q||"").toLowerCase();
  const list = q ? costumes.filter(c=>c.title.toLowerCase().includes(q)) : costumes;
  res.json(list);
});

app.get("/api/costumes/:id", (req,res)=>{
  const id = Number(req.params.id);
  const item = costumes.find(c=>c.id===id);
  if(!item) return res.status(404).json({message:"Not found"});
  res.json(item);
});

// --- reservations (rent)
function overlaps(aFrom,aTo,bFrom,bTo){
  const A1=+new Date(aFrom), A2=+new Date(aTo), B1=+new Date(bFrom), B2=+new Date(bTo);
  return !(A2<=B1 || A1>=B2);
}

app.get("/api/reservations", (_,res)=> res.json(reservations));

app.post("/api/reservations",(req,res)=>{
  const { costumeId, from, to, size="M", user="u1" } = req.body||{};
  if(!costumeId||!from||!to) return res.status(400).json({message:"costumeId/from/to required"});
  const item = costumes.find(c=>c.id===costumeId);
  if(!item) return res.status(404).json({message:"Costume not found"});

  const conflict = reservations.some(r=>r.costumeId===costumeId && overlaps(from,to,r.from,r.to) && r.status!=="cancelled");
  if(conflict) return res.status(409).json({message:"Dates not available"});

  // simple total calc
  const days = Math.ceil((+new Date(to) - +new Date(from)) / (1000*60*60*24));
  if(days<=0) return res.status(400).json({message:"Invalid dates"});
  const total = days * item.pricePerDay;

  const newRes = { id:"r"+(reservations.length+1), user, costumeId, from, to, size, total, status:"pending" };
  reservations.push(newRes);
  res.status(201).json(newRes);
});

// --- purchase (buy)
app.get("/api/orders", (_,res)=> res.json(orders));

app.post("/api/purchase", (req,res)=>{
  const { costumeId, qty=1, size="M", user="u1" } = req.body||{};
  if(!costumeId) return res.status(400).json({message:"costumeId required"});
  const item = costumes.find(c=>c.id===costumeId);
  if(!item) return res.status(404).json({message:"Costume not found"});
  const q = Math.max(1, Number(qty)||1);
  const total = q * item.priceBuy;

  const order = {
    id: "o"+(orders.length+1),
    user,
    costumeId,
    size,
    qty: q,
    unitPrice: item.priceBuy,
    total,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`));
