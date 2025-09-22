import express from "express";

import {
  createGuruController,
  createRiwayatPendidikanController,
  createSiswaController,
  deleteGuruController,
  deleteRiwayatPendidikanController,
  deleteSiswaController,
  getAllGuruController,
  getAllSiswaController,
  getGuruByIDController,
  getSiswaByIDController,
  updateGuruController,
  updateSiswaController,
} from "../controller/userController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/user/create-guru", AuthMiddleware, createGuruController);
router.put("/user/update-guru/:idGuru", AuthMiddleware, updateGuruController);
router.get("/user/get-guru/:idGuru", AuthMiddleware, getGuruByIDController);
router.delete(
  "/user/delete-guru/:idGuru",
  AuthMiddleware,
  deleteGuruController
);
router.get("/user/get-all-guru", AuthMiddleware, getAllGuruController);
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

router.post("/user/create-siswa", AuthMiddleware, createSiswaController);
router.put(
  "/user/update-siswa/:idSiswa",
  AuthMiddleware,
  updateSiswaController
);
router.get("/user/get-siswa/:idSiswa", AuthMiddleware, getSiswaByIDController);
router.delete(
  "/user/delete-siswa/:idSiswa",
  AuthMiddleware,
  deleteSiswaController
);
router.get("/user/get-all-siswa", AuthMiddleware, getAllSiswaController);

export default router;
