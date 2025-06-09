import express from "express";
import {
  handleCreatePendaftaran,
  handleGetAllPendaftaran,
  handleGetPendaftaranById,
} from "../controller/pendaftaranController.js";

const router = express.Router();

router.post("/pendaftaran", handleCreatePendaftaran);
router.get("/pendaftaran", handleGetAllPendaftaran);
router.get("/pendaftaran/:id", handleGetPendaftaranById); // 🔹 Tambahan route baru

export default router;
