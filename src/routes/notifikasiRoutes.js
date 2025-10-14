import express from "express";
import {
  getNotifikasiController,
  updateStatusSiswaController,
  updateStatusGuruController,
  getNotifikasiControllerTotal,
} from "../controller/notifikasiController.js";
import {
  AuthMiddleware,
  isGuruOnly,
  isSiswa,
} from "../utils/authMiddleware.js";

const router = express.Router();

// Ambil semua notifikasi user
router.get("/notifikasi", AuthMiddleware, getNotifikasiController);
router.get("/notifikasi-total", AuthMiddleware, getNotifikasiControllerTotal);

// Update & hapus notifikasi siswa
router.put(
  "/notifikasi/siswa",
  AuthMiddleware,
  isSiswa,
  updateStatusSiswaController
);

// Update & hapus notifikasi guru
router.put(
  "/notifikasi/guru",
  AuthMiddleware,
  isGuruOnly,
  updateStatusGuruController
);

export default router;
