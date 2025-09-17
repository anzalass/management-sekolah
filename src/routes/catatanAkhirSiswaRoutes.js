import express from "express";
import {
  createCatatanAkhirSiswaController,
  deleteCatatanAkhirSiswaController,
  getAllCatatanAkhirSiswaController,
  getCatatanAkhirSiswaByIdController,
  getCatatanAkhirSiswaByKelasMapelController,
  updateCatatanAkhirSiswaController,
} from "../controller/catatanAkhirSiswaController.js";

const router = express.Router();

router.post("/catatan-akhir-siswa", createCatatanAkhirSiswaController);
router.get("/catatan-akhir-siswa", getAllCatatanAkhirSiswaController);
router.get("/catatan-akhir-siswa/:id", getCatatanAkhirSiswaByIdController);
router.put("/catatan-akhir-siswa/:id", updateCatatanAkhirSiswaController);
router.delete("/catatan-akhir-siswa/:id", deleteCatatanAkhirSiswaController);
router.get(
  "/catatan-akhir-siswa/kelas/:idKelasMapel",
  getCatatanAkhirSiswaByKelasMapelController
);

export default router;
