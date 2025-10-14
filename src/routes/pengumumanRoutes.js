import express from "express";

import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";
import {
  createPengumumanController,
  deletePengumumanController,
  getAllPengumumanController,
  getPengumumanByIdController,
  updatePengumumanController,
} from "../controller/pengumumanController.js";
const router = express.Router();

router.post(
  "/pengumuman/create",
  AuthMiddleware,
  isKepalaSekolah,
  createPengumumanController
);
router.put(
  "/pengumuman/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updatePengumumanController
);
router.delete(
  "/pengumuman/delete/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deletePengumumanController
);
router.get(
  "/pengumuman/get/:id",
  AuthMiddleware,
  isKepalaSekolah,
  getPengumumanByIdController
);
router.get(
  "/pengumuman",
  AuthMiddleware,
  isKepalaSekolah,
  getAllPengumumanController
);

export default router;
