import express from "express";
import {
  createJadwalPelajaranController,
  deleteJadwalPelajaranController,
  getJadwalPelajaranController,
} from "../controller/jadwalPelajaranController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import { getJadwalMengajarByIdGuruController } from "../controller/jadwalMengajarController.js";

const router = express.Router();

router.post("/jadwal", createJadwalPelajaranController);
router.delete("/jadwal/:id", deleteJadwalPelajaranController);
router.get("/jadwal/:idKelas", getJadwalPelajaranController);
router.get("/jadwal-guru", AuthMiddleware, getJadwalMengajarByIdGuruController);

export default router;
