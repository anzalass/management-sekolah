import express from "express";
const router = express.Router();
import {
  createSekolahController,
  getSekolahController,
  updateSekolahController,
} from "../controller/sekolahController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

router.put(
  "/sekolah",
  AuthMiddleware,
  isKepalaSekolah,
  updateSekolahController
);
router.post(
  "/sekolah/create",
  AuthMiddleware,
  isKepalaSekolah,
  createSekolahController
);
router.get("/sekolah", AuthMiddleware, isKepalaSekolah, getSekolahController);

export default router;
