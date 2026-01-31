import express from "express";
import * as pengumumanKelasController from "../controller/pengumumanKelasController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
import memoryUpload from "../utils/multer.js";

const router = express.Router();

router.post(
  "/pengumuman-kelas",
  AuthMiddleware,
  isGuruOnly,
  memoryUpload.single("image"),
  pengumumanKelasController.createPengumumanKelas
);

router.put(
  "/pengumuman-kelas/:id",
  AuthMiddleware,
  isGuruOnly,
  memoryUpload.single("image"),
  pengumumanKelasController.updatePengumumanKelas
);
router.get(
  "/pengumuman-kelas",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.getAllPengumumanKelas
);
router.get(
  "/pengumuman-kelas/:id",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.getPengumumanKelasById
);

router.get(
  "/pengumuman-idkelas-/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.getPengumumanKelasByKelasId
);

router.delete(
  "/pengumuman-kelas/:id",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.deletePengumumanKelas
);

router.get(
  "/pengumuman-data-kelas",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.getAllKelasAndMapelByGuruController
);

router.get(
  "/pengumuman-kelas-guru",
  AuthMiddleware,
  isGuruOnly,
  pengumumanKelasController.getPengumumanKelasByKelasByGuru
);

export default router;
