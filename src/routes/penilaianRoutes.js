import express from "express";
import {
  createJenisNilaiController,
  deleteJenisNilaiController,
  getJenisNilaiAndNilaiSiswaByKelasMapelController,
  updateNilaiSiswaController,
} from "../controller/penilaianController.js";

const router = express.Router();

router.post("/penilaian", createJenisNilaiController);
router.delete("/penilaian/:id", deleteJenisNilaiController);
router.get(
  "/penilaian/kelas/:idKelasMapel",
  getJenisNilaiAndNilaiSiswaByKelasMapelController
);

router.put("/nilai-siswa/:id", updateNilaiSiswaController);

export default router;
