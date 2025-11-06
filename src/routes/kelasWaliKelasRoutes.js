import express from "express";
import {
  addSiswatoKelasWaliKelasController,
  createKelasWaliKelasController,
  deleteKelasWaliKelasController,
  deleteSiswatoKelasWaliKelasController,
  getKelasWaliKelasByIdController,
  getSiswaByIdKelasHandler,
  terbitkanRapotController,
  updateKelasWaliKelasController,
} from "../controller/kelasWalikelasController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
const router = express.Router();

router.post(
  "/kelas-walikelas/create",
  AuthMiddleware,
  createKelasWaliKelasController
);
router.put(
  "/kelas-walikelas/update/:id",
  AuthMiddleware,
  isGuruOnly,
  updateKelasWaliKelasController
);
router.delete(
  "/kelas-walikelas/delete/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteKelasWaliKelasController
);
router.get(
  "/kelas-walikelas/get/:id",
  AuthMiddleware,
  isGuruOnly,
  getKelasWaliKelasByIdController
);
router.post(
  "/kelas-walikelas/add",
  AuthMiddleware,
  isGuruOnly,
  addSiswatoKelasWaliKelasController
);
router.delete(
  "/kelas-walikelas/remove/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteSiswatoKelasWaliKelasController
);
router.get(
  "/kelas-walikelas/siswa/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getSiswaByIdKelasHandler
);
router.patch(
  "/kelas-walikelas/terbit/:id",
  AuthMiddleware,
  isGuruOnly,
  terbitkanRapotController
);
export default router;
