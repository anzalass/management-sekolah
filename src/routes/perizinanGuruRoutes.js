import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createPerizinanGuruController,
  deletePerizinanGuruController,
  getPerizinanGuruByIdController,
  updatePerizinanGuruController,
} from "../controller/perizinanGuruController.js";

const router = express.Router();

router.post(
  "/perizinan-guru/create",
  AuthMiddleware,
  createPerizinanGuruController
);
router.get("/perizinan-guru/get/:id", getPerizinanGuruByIdController);
router.put("/perizinan-guru/update/:id", updatePerizinanGuruController);
router.delete("/perizinan-guru/delete/:id", deletePerizinanGuruController);

export default router;
