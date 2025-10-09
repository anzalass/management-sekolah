import express from "express";
import * as catatanController from "../controller/catatanPerkembanganSiswaController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/catatan-siswa", catatanController.createCatatan);
router.get("/catatan-siswa", catatanController.getAllCatatan);
router.get(
  "/catatan-siswaa",
  AuthMiddleware,
  catatanController.getAllCatatanByIdSiswaIdKelas
);
router.get("/catatan-siswa/:id", catatanController.getCatatanById);
router.get(
  "/catatan-siswa/kelas/:idKelas",
  catatanController.getCatatanByIdKelas
);
router.put("/catatan-siswa/:id", catatanController.updateCatatan);
router.delete("/catatan-siswa/:id", catatanController.deleteCatatan);

export default router;
