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
  updateGuruController,
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
