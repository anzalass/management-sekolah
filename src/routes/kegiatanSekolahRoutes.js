import express from "express";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";
import {
  createKegiatanSekolahController,
  deleteKegiatanSekolahController,
  getAllKegiatanSekolah2Controller,
  getAllKegiatanSekolahController,
  getKegiatanSekolahByIdController,
  updateKegiatanSekolahController,
  updateStatusKegiatanSekolahController,
} from "../controller/kegiatanSekolahController.js";

const router = express.Router();

router.post(
  "/kegiatan-sekolah/create",
  AuthMiddleware,
  isKepalaSekolah,
  createKegiatanSekolahController
);
router.get("/kegiatan-sekolah/get/:id", getKegiatanSekolahByIdController);
router.put(
  "/kegiatan-sekolah/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updateKegiatanSekolahController
);
router.delete(
  "/kegiatan-sekolah/delete/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteKegiatanSekolahController
);
router.get(
  "/kegiatan-sekolah",
  AuthMiddleware,
  isKepalaSekolah,
  getAllKegiatanSekolahController
);

router.get(
  "/kegiatan-sekolah-2",
  AuthMiddleware,
  getAllKegiatanSekolah2Controller
);
router.put(
  "/kegiatan-sekolah/status/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updateStatusKegiatanSekolahController
);

export default router;
