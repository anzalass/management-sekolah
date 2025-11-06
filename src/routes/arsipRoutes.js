import express from "express";
import {
  getAllArsipController,
  createArsipController,
  deleteArsipController,
} from "../controller/arsipController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/arsip", AuthMiddleware, isKepalaSekolah, getAllArsipController);
router.post("/arsip", AuthMiddleware, isKepalaSekolah, createArsipController);
router.delete(
  "/arsip/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteArsipController
);

export default router;
