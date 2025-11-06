import express from "express";
import * as catatanController from "../controller/catatanPerkembanganSiswaController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/catatan-siswa", isGuruOnly, catatanController.createCatatan);
router.get("/catatan-siswa", isGuruOnly, catatanController.getAllCatatan);
router.get(
  "/catatan-siswaa",
  isGuruOnly,
  AuthMiddleware,
  catatanController.getAllCatatanByIdSiswaIdKelas
);
router.get("/catatan-siswa/:id", isGuruOnly, catatanController.getCatatanById);
router.get(
  "/catatan-siswa/kelas/:idKelas",
  isGuruOnly,
  catatanController.getCatatanByIdKelas
);
router.put("/catatan-siswa/:id", isGuruOnly, catatanController.updateCatatan);
router.delete(
  "/catatan-siswa/:id",
  isGuruOnly,
  catatanController.deleteCatatan
);

export default router;
