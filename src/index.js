import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import { DendaTelatBayar } from "./scheduler/cron.js";
import fs from "fs";
import webpush from "web-push";

// ROUTES
import sekolaRoutes from "../src/routes/sekolahRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import userRoutes from "../src/routes/userRoutes.js";
import ekstraKulikulerRoutes from "../src/routes/ekstrakulikulerRoutes.js";
import inventarisRoutes from "../src/routes/inventarisRoutes.js";
import kegiatanSekolahRoutes from "../src/routes/kegiatanSekolahRoutes.js";
import mataPelajaranRoutes from "../src/routes/mataPelajaranRoutes.js";
import perpustakaanRoutes from "../src/routes/perpustakaanRoutes.js";
import ruangRoutes from "../src/routes/ruangRoutes.js";
import anggaranRoutes from "../src/routes/anggaranRoutes.js";
import pengumumanRoutes from "../src/routes/pengumumanRoutes.js";
import kehadiranGuruDanStaffRoutes from "../src/routes/kehadiranGurudanStaffRoutes.js";
import testimoniRoutes from "../src/routes/testimoniRoutes.js";
import newsRoutes from "../src/routes/newsRoutes.js";
import galleryRoutes from "../src/routes/galleryRoutes.js";
import guruTemplate from "../src/routes/guruTemplateRoutes.js";
import raportRoutes from "../src/routes/raportRoutes.js";
import perizinanGuruRoutes from "../src/routes/perizinanGuruRoutes.js";
import jadwalMengajarRoutes from "../src/routes/jadwalMengajarRoutes.js";
import kelasWaliKelasRoutes from "../src/routes/kelasWaliKelasRoutes.js";
import kelasMapelRoutes from "../src/routes/kelasMapelRoutes.js";
import pageRoutes from "../src/routes/pageRoutes.js";
import bkRoutes from "../src/routes/bkroutes.js";
import materiRoutes from "../src/routes/materiTugasSummaryRoutes.js";
import penilaianRoutes from "../src/routes/penilaianRoutes.js";
import arsipRoutes from "../src/routes/arsipRoutes.js";
import kehadiranSiswaRoutes from "../src/routes/kehadiranSiswaRoutes.js";
import catatahnPerkembanganSiswa from "../src/routes/catatanPerkembanganSiswaRoutes.js";
import pengumumanKelasRoutes from "../src/routes/pengumumanKelasRoutes.js";
import listKelasRoutes from "../src/routes/listKelasRoutes.js";
import catatanAkhirSiswaRoutes from "../src/routes/catatanAkhirSiswaRoutes.js";
import siswaRoutes from "../src/routes/siswa/siswaRoutes.js";
import perizinanSiswa from "../src/routes/siswa/perizinanSiswaRoutes.js";
import pembayaranRoutes from "../src/routes/pembayaranRoutes.js";
import jadwalRoutes from "../src/routes/jadwalPelajaranRoutes.js";
import janjiTemuRoutes from "../src/routes/siswa/janjiTemuRoutes.js";
import ujianRoutes from "../src/routes/ujianIframeRoutes.js";
import weeklyActivity from "../src/routes/weeklyActivityRoutes.js";
import notifikasiRoutes from "../src/routes/notifikasiRoutes.js";
import pendaftaranRoutes from "../src/routes/pendaftaranRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = process.env.WEB_PORT || process.env.PORT || 4000; // ⬅️ ini kunci
const corsOptions = {
  origin: `${process.env.SERVER_FE}`,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(cookieParser()); // ✅ WAJIB!
app.use(cors(corsOptions));

// server.js
app.options("*", cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Management Sekolah API running" });
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
app.use("/api/v1", testimoniRoutes);
app.use("/api/v1", newsRoutes);
app.use("/api/v1", galleryRoutes);
app.use("/api/v1", guruTemplate);
app.use("/api/v1", raportRoutes);
app.use("/api/v1", perizinanGuruRoutes);
app.use("/api/v1", jadwalMengajarRoutes);
app.use("/api/v1", kelasWaliKelasRoutes);
app.use("/api/v1", kelasMapelRoutes);
app.use("/api/v1", pageRoutes);
app.use("/api/v1", bkRoutes);
app.use("/api/v1", materiRoutes);
app.use("/api/v1", penilaianRoutes);
app.use("/api/v1", arsipRoutes);
app.use("/api/v1", kehadiranSiswaRoutes);
app.use("/api/v1", catatahnPerkembanganSiswa);
app.use("/api/v1", pengumumanKelasRoutes);
app.use("/api/v1", listKelasRoutes);
app.use("/api/v1", pembayaranRoutes);
app.use("/api/v1", catatanAkhirSiswaRoutes);
app.use("/api/v1", siswaRoutes);
app.use("/api/v1", jadwalRoutes);
app.use("/api/v1", perizinanSiswa);
app.use("/api/v1", janjiTemuRoutes);
app.use("/api/v1", ujianRoutes);
app.use("/api/v1", weeklyActivity);
app.use("/api/v1", notifikasiRoutes);
app.use("/api/v1", pendaftaranRoutes);

DendaTelatBayar();

webpush.setVapidDetails(
  "mailto:admin@yourdomain.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/* ================= EXPORT (WAJIB) ================= */
export default app;
