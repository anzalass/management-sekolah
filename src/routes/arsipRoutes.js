import express from "express";
import {
  getAllArsipController,
  createArsipController,
  deleteArsipController,
  uploadFileController,
} from "../controller/arsipController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";
import multer from "multer";
import memoryUpload from "../utils/multer.js";
import { uploadFile } from "../utils/multerFile.js";

const router = express.Router();

router.get("/arsip", AuthMiddleware, isKepalaSekolah, getAllArsipController);
router.post("/arsip", AuthMiddleware, isKepalaSekolah, createArsipController);
router.delete(
  "/arsip/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteArsipController
);

router.post("/arsip-drive", uploadFile.single("file"), uploadFileController);

export default router;
