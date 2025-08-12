import express from "express";
import {
  createJadwalMengajarController,
  deleteJadwalMengajarController,
  updateJadwalMengajarController,
} from "../controller/jadwalMengajarController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// [POST] Tambah jadwal mengajar
router.post(
  "/jadwal-mengajar/create",
  AuthMiddleware,
  createJadwalMengajarController
);

// [PUT] Update jadwal mengajar berdasarkan ID
router.put(
  "/jadwal-mengajar/update/:id",
  AuthMiddleware,
  updateJadwalMengajarController
);

// [DELETE] Hapus jadwal mengajar berdasarkan ID
router.delete(
  "jadwal-mengajar/delete/:id",
  AuthMiddleware,
  deleteJadwalMengajarController
);

export default router;
