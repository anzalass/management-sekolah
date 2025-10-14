import express from "express";
import {
  createJenisNilaiController,
  createNilaiSiswaController,
  deletedNilaiSiswaController,
  deleteJenisNilaiController,
  getJenisNilaiAndNilaiSiswaByKelasMapelController,
  getRekapNilaiKelasBaruController,
  updateJenisNilaiController,
  updateNilaiSiswaController,
} from "../controller/penilaianController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/penilaian",
  AuthMiddleware,
  isGuruOnly,
  createJenisNilaiController
);
router.delete(
  "/penilaian/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteJenisNilaiController
);
router.put(
  "/penilaian/:id",
  AuthMiddleware,
  isGuruOnly,
  updateJenisNilaiController
);

router.get(
  "/penilaian/kelas/:idKelasMapel",
  AuthMiddleware,
  isGuruOnly,
  getJenisNilaiAndNilaiSiswaByKelasMapelController
);

router.put(
  "/nilai-siswa/:id",
  AuthMiddleware,
  isGuruOnly,
  updateNilaiSiswaController
);
router.post(
  "/nilai-siswa",
  AuthMiddleware,
  isGuruOnly,
  createNilaiSiswaController
);
router.delete(
  "/nilai-siswa/:id",
  AuthMiddleware,
  isGuruOnly,
  deletedNilaiSiswaController
);
router.get(
  "/rekap-nilai-siswa/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getRekapNilaiKelasBaruController
);

export default router;
