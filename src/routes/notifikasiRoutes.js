import express from "express";
import {
  getNotifikasiController,
  updateStatusSiswaController,
  updateStatusGuruController,
} from "../controller/notifikasiController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// Ambil semua notifikasi user
router.get("/notifikasi", AuthMiddleware, getNotifikasiController);

// Update & hapus notifikasi siswa
router.put("/notifikasi/siswa", AuthMiddleware, updateStatusSiswaController);

// Update & hapus notifikasi guru
router.put("/notifikasi/guru", AuthMiddleware, updateStatusGuruController);

export default router;
