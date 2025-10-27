import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import costumesRouter from './routes/costumes.js';
import reservationsRouter from './routes/reservation.js';
import ordersRouter from './routes/orders.js';


async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDatabase(); 


const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "FreakOrTreat API" });
});


app.use('/api/costumes', costumesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/orders', ordersRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
