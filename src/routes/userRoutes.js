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

router.post("/user/create-guru", createGuruController);
router.put("/user/update-guru/:idGuru", updateGuruController);
router.get("/user/get-guru/:idGuru", getGuruByIDController);
router.delete("/user/delete-guru/:idGuru", deleteGuruController);
router.get("/user/get-all-guru", getAllGuruController);
router.post(
  "/user/create-riwayat-pendidikan/:idGuru",
  createRiwayatPendidikanController
);
router.delete(
  "/user/delete-riwayat-pendidikan/:id",
  deleteRiwayatPendidikanController
);

router.post("/user/create-siswa", createSiswaController);
router.put("/user/update-siswa/:idSiswa", updateSiswaController);
router.get("/user/get-siswa/:idSiswa", getSiswaByIDController);
router.delete("/user/delete-siswa/:idSiswa", deleteSiswaController);
router.get("/user/get-all-siswa", getAllSiswaController);

export default router;
