import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createBukuPerpustakaanController,
  createPeminjamanController,
  deleteBukuPerpustakaanController,
  deletePeminjamanController,
  getBukuPerpustakaanByIdController,
  updateBukuPerpustakaanController,
  updatePeminjamanController,
  updateStatusPeminjamanController,
} from "../controller/perpustakaanController.js";

const router = express.Router();

router.post("/perpus/create", createBukuPerpustakaanController);
router.get("/perpus/get/:id", getBukuPerpustakaanByIdController);
router.put("/perpus/update/:id", updateBukuPerpustakaanController);
router.delete("/perpus/delete/:id", deleteBukuPerpustakaanController);
router.post("/perpus/create-peminjaman", createPeminjamanController);
router.put(
  "/perpus/update-status-peminjaman",
  updateStatusPeminjamanController
);
router.put("/perpus/update-peminjaman", updatePeminjamanController);
router.delete("/perpus/delete-peminjaman", deletePeminjamanController);
export default router;
