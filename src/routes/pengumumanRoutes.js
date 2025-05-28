import express from "express";

import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createPengumumanController,
  deletePengumumanController,
  getAllPengumumanController,
  getPengumumanByIdController,
  updatePengumumanController,
} from "../controller/pengumumanController.js";
const router = express.Router();

router.post("/pengumuman/create", createPengumumanController);
router.put("/pengumuman/update/:id", updatePengumumanController);
router.delete("/pengumuman/delete/:id", deletePengumumanController);
router.get("/pengumuman/get/:id", getPengumumanByIdController);
router.get("/pengumuman", getAllPengumumanController);

export default router;
