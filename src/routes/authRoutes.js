import express from "express";
import {
  loginController,
  resetPasswordController,
} from "../controller/authController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/auth/login", loginController);
router.get("/auth/reset-password", AuthMiddleware, resetPasswordController);

export default router;
