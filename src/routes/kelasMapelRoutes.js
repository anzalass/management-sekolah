import express from "express";
import {
  addSiswatoKelasKelasMapelController,
  createKelasMapelController,
  deleteKelasMapelController,
  getDetailKelasMapelController,
  removeSiswaFromKelasMapelController,
  updateKelasMapelController,
} from "../controller/kelasMapelController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/kelas-mapel/create",
  AuthMiddleware,
  isGuruOnly,
  createKelasMapelController
);
router.put(
  "/kelas-mapel/update/:id",
  AuthMiddleware,
  isGuruOnly,
  updateKelasMapelController
);
router.delete(
  "/kelas-mapel/delete/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteKelasMapelController
);
router.post(
  "/kelas-mapel/add-siswa",
  AuthMiddleware,
  isGuruOnly,
  addSiswatoKelasKelasMapelController
);
router.delete(
  "/kelas-mapel/remove-siswa/:id",
  AuthMiddleware,
  isGuruOnly,
  removeSiswaFromKelasMapelController
);

router.get(
  "/kelas-mapel/:id",
  AuthMiddleware,
  isGuruOnly,
  getDetailKelasMapelController
);

export default router;
