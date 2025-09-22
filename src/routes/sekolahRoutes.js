import express from "express";
const router = express.Router();
import {
  createSekolahController,
  getSekolahController,
  updateSekolahController,
} from "../controller/sekolahController.js";

router.put("/sekolah", updateSekolahController);
router.post("/sekolah/create", createSekolahController);
router.get("/sekolah", getSekolahController);

export default router;
