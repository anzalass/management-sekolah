import express from "express";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
import {
  absenMasukGuruController,
  absenPulangGuruController,
  getKehadiranGuruController,
  rekapHadirBulanan,
} from "../controller/kehadiranGurudanStaffController.js";

const router = express.Router();

router.post(
  "/absen-masuk",
  AuthMiddleware,
  isGuruOnly,
  absenMasukGuruController
);
router.post(
  "/absen-pulang",
  AuthMiddleware,
  isGuruOnly,
  absenPulangGuruController
);
router.get(
  "/kehadiran-guru",
  AuthMiddleware,
  isGuruOnly,
  getKehadiranGuruController
);

router.get(
  "/rekap-kehadiran-guru",
  AuthMiddleware,
  isGuruOnly,
  rekapHadirBulanan
);
export default router;
