import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
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
  createPerizinanGuruController
);
router.get("/perizinan-guru/get/:id", getPerizinanGuruByIdController);
router.put("/perizinan-guru/acc/:id", approvePerizinanGuru);
router.put("/perizinan-guru/reject/:id", rejectPerizinanGuru);

router.delete("/perizinan-guru/delete/:id", deletePerizinanGuruController);
router.get("/perizinan-guru", getPerizinanGuruController);
export default router;
