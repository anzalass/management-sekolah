import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createKegiatanSekolahController,
  deleteKegiatanSekolahController,
  getAllKegiatanSekolahController,
  getKegiatanSekolahByIdController,
  updateKegiatanSekolahController,
  updateStatusKegiatanSekolahController,
} from "../controller/kegiatanSekolahController.js";

const router = express.Router();

router.post(
  "/kegiatan-sekolah/create",
  AuthMiddleware,
  createKegiatanSekolahController
);
router.get("/kegiatan-sekolah/get/:id", getKegiatanSekolahByIdController);
router.put(
  "/kegiatan-sekolah/update/:id",
  AuthMiddleware,
  updateKegiatanSekolahController
);
router.delete(
  "/kegiatan-sekolah/delete/:id",
  AuthMiddleware,
  deleteKegiatanSekolahController
);
router.get(
  "/kegiatan-sekolah",
  AuthMiddleware,
  getAllKegiatanSekolahController
);
router.put(
  "/kegiatan-sekolah/status/:id",
  AuthMiddleware,
  updateStatusKegiatanSekolahController
);

export default router;
