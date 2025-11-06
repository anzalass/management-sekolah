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
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/kehadiran", AuthMiddleware, isGuruOnly, createKehadiranHandler);
router.post(
  "/kehadiran-manual",
  AuthMiddleware,
  isGuruOnly,
  createKehadiranManualHandler
);

router.delete(
  "/kehadiran-manual/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteKehadiranHandler
);
router.get(
  "/kehadiran/hari-ini/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getSiswaByKelasWithKehadiranHariIniHandler
);
router.put(
  "/kehadiran/:id",
  AuthMiddleware,
  isGuruOnly,
  updateKeteranganHandler
);
router.get("/absensi/:idKelas", AuthMiddleware, isGuruOnly, getAbsensiByKelas);
router.get(
  "/rekap-absensi/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getRekapAbsensiByKelasController
);
router.get(
  "/absensi-siswa/:idKelas/:idSiswa",
  AuthMiddleware,
  isGuruOnly,
  getAbsensiSiswaByKelasController
);

export default router;
