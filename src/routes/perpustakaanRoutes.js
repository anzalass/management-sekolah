import express from "express";
import multer from "multer";

import {
  createBukuController,
  getAllBukuController,
  deleteBukuController,
  pinjamBukuController,
  kembalikanBukuController,
  deletePeminjamanController,
  getBukuByIdController,
  updateBukuController,
  getAllPeminjamanPengembalianController,
} from "../controller/perpustakaanController.js";
import { AuthMiddleware, hasRole } from "../utils/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// === Rute Buku ===
router.post(
  "/buku",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  createBukuController
);
router.get("/buku", AuthMiddleware, getAllBukuController);
router.delete(
  "/buku/:id",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  deleteBukuController
);
router.get("/buku/:id", AuthMiddleware, getBukuByIdController);
router.put(
  "/buku/:id",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  updateBukuController
);

// === Rute Peminjaman & Pengembalian ===
router.post(
  "/peminjaman",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  pinjamBukuController
);
router.get(
  "/peminjaman",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  getAllPeminjamanPengembalianController
);

router.post(
  "/pengembalian/:id",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  kembalikanBukuController
);
router.delete(
  "/peminjaman/:id",
  AuthMiddleware,
  hasRole("Guru Perpus", "Kepala Sekolah"),
  deletePeminjamanController
);

export default router;
