import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sekolaRoutes from "./routes/sekolahRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ekstraKulikulerRoutes from "./routes/ekstrakulikulerRoutes.js";
import inventarisRoutes from "./routes/inventarisRoutes.js";
import kegiatanSekolahRoutes from "./routes/kegiatanSekolahRoutes.js";
import mataPelajaranRoutes from "./routes/mataPelajaranRoutes.js";
import perpustakaanRoutes from "./routes/perpustakaanRoutes.js";
import ruangRoutes from "./routes/ruangRoutes.js";
import anggaranRoutes from "./routes/anggaranRoutes.js";
import pengumumanRoutes from "./routes/pengumumanRoutes.js";
import kehadiranGuruDanStaffRoutes from "./routes/kehadiranGurudanStaffRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000", // Sesuaikan dengan frontend kamu
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Management Sekolah");
});

app.use("/api/v1", anggaranRoutes);
app.use("/api/v1", sekolaRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", ekstraKulikulerRoutes);
app.use("/api/v1", inventarisRoutes);
app.use("/api/v1", kegiatanSekolahRoutes);
app.use("/api/v1", mataPelajaranRoutes);
app.use("/api/v1", perpustakaanRoutes);
app.use("/api/v1", ruangRoutes);
app.use("/api/v1", kehadiranGuruDanStaffRoutes);
app.use("/api/v1", pengumumanRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
