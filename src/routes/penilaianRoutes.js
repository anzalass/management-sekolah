import express from "express";
import {
  createJenisNilaiController,
  deleteJenisNilaiController,
  getJenisNilaiAndNilaiSiswaByKelasMapelController,
  getRekapNilaiKelasBaruController,
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
router.get("/rekap-nilai-siswa/:idKelas", getRekapNilaiKelasBaruController);

export default router;
