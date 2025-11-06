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
import { AuthMiddleware, hasRole } from "../utils/authMiddleware.js";

const router = express.Router();

// ===== ROUTE KONSELING =====
router.post(
  "/konseling",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  createKonselingController
);
router.get(
  "/konseling",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  getAllKonselingController
);
router.get(
  "/konseling/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  getByIdKonselingController
);
router.put(
  "/konseling/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  updateKonselingController
);
router.delete(
  "/konseling/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  removeKonselingController
);
router.get(
  "/konseling-siswa",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  AuthMiddleware,
  getKonselingBySiswaController
);

// ===== ROUTE PELANGGARAN / PRESTASI =====
router.post(
  "/pelanggaran-prestasi",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  createPelanggaranPrestasiController
);
router.get(
  "/pelanggaran-prestasi",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  getAllPelanggaranPrestasiController
);
router.get(
  "/pelanggaran-prestasi/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  getByIdPelanggaranPrestasiController
);
router.put(
  "/pelanggaran-prestasi/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  updatePelanggaranPrestasiController
);
router.delete(
  "/pelanggaran-prestasi/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru BK"),
  removePelanggaranPrestasiController
);

export default router;
