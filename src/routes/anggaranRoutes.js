import express from "express";
import {
  createAnggaranController,
  deleteAnggaranController,
  getAllAnggaranControllers,
  getAnggaranByIdController,
  updateAnggaranController,
} from "../controller/anggaranController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/anggaran/create", createAnggaranController);
router.put("/anggaran/update/:idAnggaran", updateAnggaranController);
router.delete("/anggaran/delete/:idAnggaran", deleteAnggaranController);
router.get("/anggaran/get/:idAnggaran", getAnggaranByIdController);
router.get("/anggaran", getAllAnggaranControllers);

export default router;
