import express from "express";
import {
  createCatatanAkhirSiswaController,
  deleteCatatanAkhirSiswaController,
  getAllCatatanAkhirSiswaController,
  getCatatanAkhirSiswaByIdController,
  getCatatanAkhirSiswaByKelasMapelController,
  updateCatatanAkhirSiswaController,
} from "../controller/catatanAkhirSiswaController.js";
import { isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/catatan-akhir-siswa",
  isGuruOnly,
  createCatatanAkhirSiswaController
);
router.get(
  "/catatan-akhir-siswa",
  isGuruOnly,
  getAllCatatanAkhirSiswaController
);
router.get(
  "/catatan-akhir-siswa/:id",
  isGuruOnly,
  getCatatanAkhirSiswaByIdController
);
router.put(
  "/catatan-akhir-siswa/:id",
  isGuruOnly,
  updateCatatanAkhirSiswaController
);
router.delete(
  "/catatan-akhir-siswa/:id",
  isGuruOnly,
  deleteCatatanAkhirSiswaController
);
router.get(
  "/catatan-akhir-siswa/kelas/:idKelasMapel",
  isGuruOnly,
  getCatatanAkhirSiswaByKelasMapelController
);

export default router;
