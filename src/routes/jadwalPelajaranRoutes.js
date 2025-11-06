import express from "express";
import {
  createJadwalPelajaranController,
  deleteJadwalPelajaranController,
  getJadwalPelajaranController,
} from "../controller/jadwalPelajaranController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
import { getJadwalMengajarByIdGuruController } from "../controller/jadwalMengajarController.js";

const router = express.Router();

router.post(
  "/jadwal",
  AuthMiddleware,
  isGuruOnly,
  createJadwalPelajaranController
);
router.delete(
  "/jadwal/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteJadwalPelajaranController
);
router.get(
  "/jadwal/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getJadwalPelajaranController
);
router.get(
  "/jadwal-guru",
  AuthMiddleware,
  isGuruOnly,
  AuthMiddleware,
  getJadwalMengajarByIdGuruController
);

export default router;
