import express from "express";
const router = express.Router();
import { updateSekolahController } from "../controller/sekolahController.js";

router.put("/sekolah/:id", updateSekolahController);

export default router;
