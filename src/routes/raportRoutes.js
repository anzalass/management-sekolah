import express from "express";
import {
  generateRaport2Controller,
  getRapotSiswaController,
} from "../controller/raportController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();
// router.get("/generate-raport/:nis", generateRaport);
router.get("/rapot3", getRapotSiswaController);
router.get("/rapot2", generateRaport2Controller);

export default router;
