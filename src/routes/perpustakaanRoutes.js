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

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// === Rute Buku ===
router.post("/buku", createBukuController);
router.get("/buku", getAllBukuController);
router.delete("/buku/:id", deleteBukuController);
router.get("/buku/:id", getBukuByIdController);
router.put("/buku/:id", updateBukuController);

// === Rute Peminjaman & Pengembalian ===
router.post("/peminjaman", pinjamBukuController);
router.get("/peminjaman", getAllPeminjamanPengembalianController);

router.post("/pengembalian/:id", kembalikanBukuController);
router.delete("/peminjaman/:id", deletePeminjamanController);

export default router;
