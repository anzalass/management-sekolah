import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createEkstraKulikulerController,
  deleteEkstraKulikulerController,
  getEkstraKulikulerByIdController,
  updateEkstraKulikulerController,
} from "../controller/ekstrakulikulerController.js";
const router = express.Router();

router.post("/eskul/create", createEkstraKulikulerController);
router.get("/eskul/get/:id", getEkstraKulikulerByIdController);
router.put("/eskul/update/:id", updateEkstraKulikulerController);
router.delete("/eskul/delete/:id", deleteEkstraKulikulerController);

export default router;
