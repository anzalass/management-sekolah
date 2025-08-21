import express from "express";
import * as pengumumanKelasController from "../controller/pengumumanKelasController.js";

const router = express.Router();

router.post(
  "/pengumuman-kelas",
  pengumumanKelasController.createPengumumanKelas
);
router.get(
  "/pengumuman-kelas",
  pengumumanKelasController.getAllPengumumanKelas
);
router.get(
  "/pengumuman-kelas/:id",
  pengumumanKelasController.getPengumumanKelasById
);

router.get(
  "/pengumuman-idkelas-/:idKelas",
  pengumumanKelasController.getPengumumanKelasByKelasId
);
router.put(
  "/pengumuman-kelas/:id",
  pengumumanKelasController.updatePengumumanKelas
);
router.delete(
  "/pengumuman-kelas/:id",
  pengumumanKelasController.deletePengumumanKelas
);

export default router;
