import express from "express";
import { createAbsensiGurudanStaffController } from "../controller/kehadiranGurudanStaffController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post(
  "/presensi-guru-staff/create",
  AuthMiddleware,
  createAbsensiGurudanStaffController
);

export default router;
