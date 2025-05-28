import express from "express";
import {
  createKelasMapelController,
  deleteKelasMapelController,
  updateKelasMapelController,
} from "../controller/kelasMapelController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  addSiswatoKelasKelasMapel,
  removeSiswaFromKelasMapel,
} from "../services/kelasMapelService.js";
const router = express.Router();

router.post("/kelas-mapel/create", createKelasMapelController);
router.put("/kelas-mapel/update/:id", updateKelasMapelController);
router.delete("/kelas-mapel/delete/:id", deleteKelasMapelController);
router.post("/kelas-mapel/add-siswa", addSiswatoKelasKelasMapel);
router.delete("/kelas-mapel/remove-siswa/:id", removeSiswaFromKelasMapel);

export default router;
