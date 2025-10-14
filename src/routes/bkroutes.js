import express from "express";
import {
  createKonselingController,
  getAllKonselingController,
  getByIdKonselingController,
  updateKonselingController,
  removeKonselingController,
  createPelanggaranPrestasiController,
  getAllPelanggaranPrestasiController,
  getByIdPelanggaranPrestasiController,
  updatePelanggaranPrestasiController,
  removePelanggaranPrestasiController,
  getKonselingBySiswaController,
} from "../controller/bkcontroller.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// ===== ROUTE KONSELING =====
router.post("/konseling", createKonselingController);
router.get("/konseling", getAllKonselingController);
router.get("/konseling/:id", getByIdKonselingController);
router.put("/konseling/:id", updateKonselingController);
router.delete("/konseling/:id", removeKonselingController);
router.get("/konseling-siswa", AuthMiddleware, getKonselingBySiswaController);

// ===== ROUTE PELANGGARAN / PRESTASI =====
router.post("/pelanggaran-prestasi", createPelanggaranPrestasiController);
router.get("/pelanggaran-prestasi", getAllPelanggaranPrestasiController);
router.get("/pelanggaran-prestasi/:id", getByIdPelanggaranPrestasiController);
router.put("/pelanggaran-prestasi/:id", updatePelanggaranPrestasiController);
router.delete("/pelanggaran-prestasi/:id", removePelanggaranPrestasiController);

export default router;
