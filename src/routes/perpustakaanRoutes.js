import express from "express";
import multer from "multer";

import {
  createBukuController,
  getAllBukuController,
  deleteBukuController,
  pinjamBukuController,
  kembalikanBukuController,
  deletePeminjamanController,
} from "../controller/perpustakaanController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// === Rute Buku ===
router.post("/buku", upload.single("foto"), createBukuController);
router.get("/buku", getAllBukuController);
router.delete("/buku/:id", deleteBukuController);

// === Rute Peminjaman & Pengembalian ===
router.post("/peminjaman", pinjamBukuController);
router.post("/pengembalian/:id", kembalikanBukuController);
router.delete("/peminjaman/:id", deletePeminjamanController);

export default router;
