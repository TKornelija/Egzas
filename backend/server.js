import dotenv from 'dotenv'; // leidzia naudoti .env failą
import express from "express" // pagrindine serverio biblioteka, leidzianti kurti REST API
import cors from "cors"; //mechanizmas, kuris leidžia serveriui priimti užklausas iš kitų duomenų, leidžia bendrauti su frontend'u.
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
// import adminAuthRoutes from "./routes/adminAuth.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
dotenv.config() 



//routerių importavimas
import costumesRouter from './routes/costumes.js';
import reservationsRouter from './routes/reservation.js';
import ordersRouter from './routes/orders.js';

//prisijungimas prie MongoDB naudojant adresą iš .env failo.
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
app.use("/api/user", userRoutes);
// // Keep admin auth and admin api under the project's preferred path
// app.use("/api/admin_users/auth", adminAuthRoutes);
// app.use("/api/admin_users", adminRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
