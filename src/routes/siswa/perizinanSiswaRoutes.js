import express from "express";
import {
  createPerizinanSiswaController,
  getAllPerizinanSiswaController,
  getPerizinanSiswaByIdController,
  updatePerizinanSiswaController,
  deletePerizinanSiswaController,
  getPerizinanSiswaByIdSiswaController,
  getPerizinanSiswaByIdKelasController,
  getPerizinanSiswaByIdKelasTodayController,
  updateStatusPerizinanSiswaController,
} from "../../controller/siswa/perizinanSiswaController.js";
import { AuthMiddleware } from "../../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/perizinan-siswa/",
  AuthMiddleware,
  createPerizinanSiswaController
);
router.get("/perizinan-siswa/", AuthMiddleware, getAllPerizinanSiswaController);
router.get(
  "/perizinan-siswa/:id",
  AuthMiddleware,
  getPerizinanSiswaByIdController
);
router.put(
  "/perizinan-siswa/:id",
  AuthMiddleware,
  updatePerizinanSiswaController
);

router.patch(
  "/perizinan-siswa-status/:id",
  AuthMiddleware,
  updateStatusPerizinanSiswaController
);
router.delete(
  "/perizinan-siswa/:id",
  AuthMiddleware,
  deletePerizinanSiswaController
);

router.get(
  "/perizinan-siswa-pribadi",
  AuthMiddleware,
  getPerizinanSiswaByIdSiswaController
);

router.get(
  "/perizinan-siswa-kelas/:idKelas",
  AuthMiddleware,
  getPerizinanSiswaByIdKelasController
);

router.get(
  "/perizinan-siswa-hari-ini/:idKelas",
  getPerizinanSiswaByIdKelasTodayController
);

export default router;
