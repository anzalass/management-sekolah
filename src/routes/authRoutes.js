import express from "express";
import {
  loginAdminController,
  loginController,
  resetPasswordController,
} from "../controller/authController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/admin", loginAdminController);
router.get("/auth/reset-password", AuthMiddleware, resetPasswordController);

export default router;
