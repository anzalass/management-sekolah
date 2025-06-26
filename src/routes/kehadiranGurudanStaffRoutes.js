import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  absenMasukGuruController,
  absenPulangGuruController,
} from "../controller/kehadiranGurudanStaffController.js";

const router = express.Router();

router.post("/absen-masuk", AuthMiddleware, absenMasukGuruController);
router.post("/absen-pulang", AuthMiddleware, absenPulangGuruController);

export default router;
