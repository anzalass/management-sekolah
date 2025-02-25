import express from "express";
const router = express.Router();
import {
  createSekolahController,
  updateSekolahController,
} from "../controller/sekolahController.js";

router.put("/sekolah/:id", updateSekolahController);
router.post("/sekolah/create", createSekolahController);

export default router;
