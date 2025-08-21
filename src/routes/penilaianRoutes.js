import express from "express";
import {
  createJenisNilaiController,
  createNilaiSiswaController,
  deletedNilaiSiswaController,
  deleteJenisNilaiController,
  getJenisNilaiAndNilaiSiswaByKelasMapelController,
  getRekapNilaiKelasBaruController,
  updateJenisNilaiController,
  updateNilaiSiswaController,
} from "../controller/penilaianController.js";

const router = express.Router();

router.post("/penilaian", createJenisNilaiController);
router.delete("/penilaian/:id", deleteJenisNilaiController);
router.put("/penilaian/:id", updateJenisNilaiController);

router.get(
  "/penilaian/kelas/:idKelasMapel",
  getJenisNilaiAndNilaiSiswaByKelasMapelController
);

router.put("/nilai-siswa/:id", updateNilaiSiswaController);
router.post("/nilai-siswa", createNilaiSiswaController);
router.delete("/nilai-siswa/:id", deletedNilaiSiswaController);
router.get("/rekap-nilai-siswa/:idKelas", getRekapNilaiKelasBaruController);

export default router;
