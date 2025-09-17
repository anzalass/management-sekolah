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
import testimoniRoutes from "./routes/testimoniRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import guruTemplate from "./routes/guruTemplateRoutes.js";
import raportRoutes from "./routes/raportRoutes.js";
import perizinanGuruRoutes from "./routes/perizinanGuruRoutes.js";
import jadwalMengajarRoutes from "./routes/jadwalMengajarRoutes.js";
import kelasWaliKelasRoutes from "./routes/kelasWaliKelasRoutes.js";
import kelasMapelRoutes from "./routes/kelasMapelRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import bkRoutes from "./routes/bkroutes.js";
import materiRoutes from "./routes/materiTugasSummaryRoutes.js";
import penilaianRoutes from "./routes/penilaianRoutes.js";
import arsipRoutes from "./routes/arsipRoutes.js";
import kehadiranSiswaRoutes from "./routes/kehadiranSiswaRoutes.js";
import catatahnPerkembanganSiswa from "./routes/catatanPerkembanganSiswaRoutes.js";
import pengumumanKelasRoutes from "./routes/pengumumanKelasRoutes.js";
import listKelasRoutes from "./routes/listKelasRoutes.js";
import catatanAkhirSiswaRoutes from "./routes/catatanAkhirSiswaRoutes.js";
import siswaRoutes from "./routes/siswa/siswaRoutes.js";
import perizinanSiswa from "./routes/siswa/perizinanSiswaRoutes.js";

import pembayaranRoutes from "./routes/pembayaranRoutes.js";
import jadwalRoutes from "./routes/jadwalPelajaranRoutes.js";
import janjiTemuRoutes from "./routes/siswa/janjiTemuRoutes.js";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pendaftaranRoutes from "./routes/pendaftaranRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(
  cors({
    origin: `${process.env.SERVER_FE}`,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

app.get("/api/v1/view-image/:imageName", (req, res) => {
  const { imageName } = req.params;

  const imagePath = path.join(__dirname, "../uploads", imageName);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.sendFile(imagePath);
  });
});
app.use("/api/v1", pendaftaranRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
