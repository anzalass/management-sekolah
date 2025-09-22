import express from "express";
import {
  loginAdminController,
  loginController,
  ubahPasswordSiswaController,
} from "../controller/authController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/admin", loginAdminController);
router.patch(
  "/auth/ubah-password-siswa",
  AuthMiddleware,
  ubahPasswordSiswaController
);

export default router;
