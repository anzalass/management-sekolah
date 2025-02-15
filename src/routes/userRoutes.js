import express from "express";

import {
  createGuruController,
  createSiswaController,
  deleteGuruController,
  deleteSiswaController,
  getGuruByNipController,
  getSiswaByNisController,
  updateGuruController,
  updateSiswaController,
} from "../controller/userController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/user/create-guru", createGuruController);
router.put("/user/update-guru/:nip", updateGuruController);
router.get("user/get-guru/:nip", getGuruByNipController);
router.delete("/user/delete-guru", deleteGuruController);

router.post("/user/create-siswa", createSiswaController);
router.put("/user/update-siswa", updateSiswaController);
router.get("user/get-siswa/:nis", getSiswaByNisController);
router.delete("/user/delete-siswa", deleteSiswaController);

export default router;
