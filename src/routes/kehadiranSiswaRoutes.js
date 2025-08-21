import express from "express";
import {
  createKehadiranHandler,
  deleteKehadiranHandler,
  getAbsensiByKelas,
  getRekapAbsensiByKelasController,
  getSiswaByKelasWithKehadiranHariIniHandler,
  updateKeteranganHandler,
} from "../controller/kehadiranSiswaController.js";

const router = express.Router();

router.post("/kehadiran", createKehadiranHandler);
router.delete("/kehadiran/:id", deleteKehadiranHandler);
router.get(
  "/kehadiran/hari-ini/:idKelas",
  getSiswaByKelasWithKehadiranHariIniHandler
);
router.put("/kehadiran/:id", updateKeteranganHandler);
router.get("/absensi/:idKelas", getAbsensiByKelas);
router.get("/rekap-absensi/:idKelas", getRekapAbsensiByKelasController);
export default router;
