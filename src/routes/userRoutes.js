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
  getGuruByNipController,
  getSiswaByNisController,
  updateGuruController,
  updateSiswaController,
} from "../controller/userController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/user/create-guru", createGuruController);
router.put("/user/update-guru/:id", updateGuruController);
router.get("/user/get-guru/:nip", getGuruByNipController);
router.delete("/user/delete-guru/:nip", deleteGuruController);
router.get("/user/get-all-guru", getAllGuruController);
router.post(
  "/user/create-riwayat-pendidikan/:nip",
  createRiwayatPendidikanController
);
router.delete(
  "/user/delete-riwayat-pendidikan/:id",
  deleteRiwayatPendidikanController
);

router.post("/user/create-siswa", createSiswaController);
router.put("/user/update-siswa/:id", updateSiswaController);
router.get("/user/get-siswa/:nis", getSiswaByNisController);
router.delete("/user/delete-siswa/:nis", deleteSiswaController);
router.get("/user/get-all-siswa", getAllSiswaController);

export default router;
