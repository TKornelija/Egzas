import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import connectDatabase from "./config/db.js";
import costumesRouter from './routes/costumes.js';
import reservationsRouter from './routes/reservation.js';
import ordersRouter from './routes/orders.js';


const app = express();
app.use(cors());
app.use(express.json());

// Middleware
// Connect to DB only when configured. Otherwise route handlers use local data files.
if (process.env.MONGODB_URI) connectDatabase();

// --- health
app.get("/api/health", (_,res)=> res.json({ ok:true, service:"FreakOrTreat API" }));

// Mount routers
app.use('/api/costumes', costumesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`));
