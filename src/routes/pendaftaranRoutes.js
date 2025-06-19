import express from "express";
const router = express.Router();

import {
  createPendaftaranController,
  getPendaftaranByIdController,
  getAllPendaftaranController,
  updatePendaftaranController,
  deletePendaftaranController
} from "../controller/pendaftaranController.js"; // Adjust path as needed
import { AuthMiddleware } from "../utils/authMiddleware.js";

router.post("/pendaftaran/", createPendaftaranController);
router.get("/pendaftaran", getAllPendaftaranController);
router.get("/pendaftaran/:id", getPendaftaranByIdController);
router.put("/pendaftaran/update/:id", AuthMiddleware, updatePendaftaranController);
router.delete("/pendaftaran/delete/:id", AuthMiddleware, deletePendaftaranController);

export default router;
