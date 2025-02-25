import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createKegiatanSekolahController,
  deleteKegiatanSekolahController,
  getAllKegiatanSekolahController,
  getKegiatanSekolahByIdController,
  updateKegiatanSekolahController,
} from "../controller/kegiatanSekolahController.js";

const router = express.Router();

router.post("/kegiatan-sekolah/create", createKegiatanSekolahController);
router.get("/kegiatan-sekolah/get/:id", getKegiatanSekolahByIdController);
router.put("/kegiatan-sekolah/update/:id", updateKegiatanSekolahController);
router.delete("/kegiatan-sekolah/delete/:id", deleteKegiatanSekolahController);
router.get("/kegiatan-sekolah", getAllKegiatanSekolahController);

export default router;
