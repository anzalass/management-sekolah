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
  waitPerizinanGuru,
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

router.put(
  "/perizinan-guru/wait/:id",
  AuthMiddleware,
  isKepalaSekolah,
  waitPerizinanGuru
);

router.delete(
  "/perizinan-guru/delete/:id",
  AuthMiddleware,
  isGuruOnly,
  deletePerizinanGuruController
);
router.get("/perizinan-guru", AuthMiddleware, getPerizinanGuruController);
export default router;
