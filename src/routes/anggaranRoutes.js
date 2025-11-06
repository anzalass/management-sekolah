import express from "express";
import {
  createAnggaranController,
  deleteAnggaranController,
  getAllAnggaranControllers,
  getAnggaranByIdController,
  updateAnggaranController,
} from "../controller/anggaranController.js";
import { AuthMiddleware, hasRole } from "../utils/authMiddleware.js";
const router = express.Router();

router.post(
  "/anggaran/create",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  createAnggaranController
);
router.put(
  "/anggaran/update/:idAnggaran",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  updateAnggaranController
);
router.delete(
  "/anggaran/delete/:idAnggaran",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  deleteAnggaranController
);
router.get(
  "/anggaran/get/:idAnggaran",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  getAnggaranByIdController
);
router.get(
  "/anggaran",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  getAllAnggaranControllers
);

export default router;
