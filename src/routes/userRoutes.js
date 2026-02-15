import express from "express";

import {
  createGuruController,
  createRiwayatPendidikanController,
  createSiswaController,
  deleteGuruController,
  deleteRiwayatPendidikanController,
  deleteSiswaController,
  getAllGuruController,
  getAllGuruMasterController,
  getAllSiswaController,
  getAllSiswaMasterController,
  getGuruByIDController,
  getSiswaByIDController,
  luluskanController,
  naikKelasController,
  updateFotoGuruController,
  updateFotoSiswaController,
  updateGuruController,
  updatePasswordController,
  updatePasswordSiswaController,
  updateSiswaController,
} from "../controller/userController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";
const router = express.Router();

router.post(
  "/user/create-guru",
  AuthMiddleware,
  isKepalaSekolah,
  createGuruController
);
router.put(
  "/user/update-guru/:idGuru",
  AuthMiddleware,
  isKepalaSekolah,
  updateGuruController
);

router.put(
  "/user/update-password-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  updatePasswordSiswaController
);

router.put(
  "/user/update-foto-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  updateFotoSiswaController
);
router.put(
  "/user/naik-kelas-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  naikKelasController
);
router.put(
  "/user/luluskan-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  luluskanController
);
router.put(
  "/user/update-password-guru/:idGuru",
  AuthMiddleware,
  isKepalaSekolah,
  updatePasswordController
);

router.put(
  "/user/update-foto-guru/:idGuru",
  AuthMiddleware,
  isKepalaSekolah,
  updateFotoGuruController
);

router.get(
  "/user/get-guru/:idGuru",
  AuthMiddleware,
  isKepalaSekolah,
  getGuruByIDController
);
router.delete(
  "/user/delete-guru/:idGuru",
  AuthMiddleware,
  isKepalaSekolah,
  deleteGuruController
);
router.get(
  "/user/get-all-guru",
  AuthMiddleware,
  isKepalaSekolah,
  getAllGuruController
);

router.get(
  "/user/get-all-guru-master",
  AuthMiddleware,
  getAllGuruMasterController
);
router.post(
  "/user/create-riwayat-pendidikan/:idGuru",
  AuthMiddleware,
  createRiwayatPendidikanController
);
router.delete(
  "/user/delete-riwayat-pendidikan/:id",
  AuthMiddleware,
  deleteRiwayatPendidikanController
);

router.post(
  "/user/create-siswa",
  AuthMiddleware,
  isKepalaSekolah,
  createSiswaController
);
router.put(
  "/user/update-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  updateSiswaController
);
router.get(
  "/user/get-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  getSiswaByIDController
);
router.delete(
  "/user/delete-siswa/:idSiswa",
  AuthMiddleware,
  isKepalaSekolah,
  deleteSiswaController
);
router.get("/user/get-all-siswa", AuthMiddleware, getAllSiswaController);
router.get(
  "/user/get-all-siswa-master",
  AuthMiddleware,
  getAllSiswaMasterController
);

export default router;
