import express from "express";
import {
  createKehadiranHandler,
  createKehadiranManualHandler,
  deleteKehadiranHandler,
  getAbsensiByKelas,
  getAbsensiSiswaByKelasController,
  getRekapAbsensiByKelasController,
  getSiswaByKelasWithKehadiranHariIniHandler,
  updateKeteranganHandler,
} from "../controller/kehadiranSiswaController.js";

const router = express.Router();

router.post("/kehadiran", createKehadiranHandler);
router.post("/kehadiran-manual", createKehadiranManualHandler);

router.delete("/kehadiran/:id", deleteKehadiranHandler);
router.get(
  "/kehadiran/hari-ini/:idKelas",
  getSiswaByKelasWithKehadiranHariIniHandler
);
router.put("/kehadiran/:id", updateKeteranganHandler);
router.get("/absensi/:idKelas", getAbsensiByKelas);
router.get("/rekap-absensi/:idKelas", getRekapAbsensiByKelasController);
router.get(
  "/absensi-siswa/:idKelas/:idSiswa",
  getAbsensiSiswaByKelasController
);

export default router;
