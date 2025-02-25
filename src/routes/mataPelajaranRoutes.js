import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createMataPelajaranController,
  deleteMataPelajaranController,
  getAllMataPelajaranController,
  getMataPelajaranByIdController,
  updateMataPelajaranController,
} from "../controller/mataPelajaranController.js";

const router = express.Router();

router.post("/mapel/create", createMataPelajaranController);
router.get("/mapel/get/:id", getMataPelajaranByIdController);
router.put("/mapel/update/:id", updateMataPelajaranController);
router.delete("/mapel/delete/:id", deleteMataPelajaranController);
router.get("/mapel", getAllMataPelajaranController);

export default router;
