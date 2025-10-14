import express from "express";
import {
  AuthMiddleware,
  isGuruOnly,
  isKepalaSekolah,
} from "../utils/authMiddleware.js";
import {
  approvePerizinanGuru,
  createPerizinanGuruController,
  deletePerizinanGuruController,
  getPerizinanGuruByIdController,
  getPerizinanGuruController,
  rejectPerizinanGuru,
} from "../controller/perizinanGuruController.js";

const router = express.Router();

router.post(
  "/perizinan-guru/create",
  AuthMiddleware,
  isGuruOnly,
  createPerizinanGuruController
);
router.get(
  "/perizinan-guru/get/:id",
  AuthMiddleware,
  isGuruOnly,
  getPerizinanGuruByIdController
);
router.put(
  "/perizinan-guru/acc/:id",
  AuthMiddleware,
  isKepalaSekolah,
  approvePerizinanGuru
);
router.put(
  "/perizinan-guru/reject/:id",
  AuthMiddleware,
  isKepalaSekolah,
  rejectPerizinanGuru
);

router.delete(
  "/perizinan-guru/delete/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deletePerizinanGuruController
);
router.get(
  "/perizinan-guru",
  AuthMiddleware,
  isKepalaSekolah,
  getPerizinanGuruController
);
export default router;
