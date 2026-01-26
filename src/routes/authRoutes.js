import express from "express";
import {
  loginAdminController,
  loginController,
  loginController2,
  logoutController,
  ubahPasswordSiswaController,
} from "../controller/authController.js";
import { AuthMiddleware, AuthMiddleware2 } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/login2", loginController2);
router.post("/auth/logout", AuthMiddleware, logoutController);

router.post("/auth/admin", loginAdminController);
router.patch(
  "/auth/ubah-password-siswa",
  AuthMiddleware,
  ubahPasswordSiswaController
);
router.get("/me", AuthMiddleware2);
export default router;
