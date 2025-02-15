import express from "express";
import {
  createAnggaranController,
  deleteAnggaranController,
  getAnggaranByIdController,
  updateAnggaranController,
} from "../controller/anggaranController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/anggaran/create", createAnggaranController);
router.put("/anggaran/update/:idAnggaran", updateAnggaranController);
router.delete("/anggaran/delete/:idAnggaran", deleteAnggaranController);
router.get("/anggaran/get/:idAnggaran", getAnggaranByIdController);

export default router;
