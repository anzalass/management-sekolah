import express from "express";
import {
  createWeeklyActivityController,
  deleteWeeklyActivityController,
  getWeeklyActivityByIdKelasController,
  getWeeklyActivityByIdKelasGuruController,
} from "../controller/weeklyActivityController.js";
import memoryUpload from "../utils/multer.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

// Create WeeklyActivity + multiple foto
router.post(
  "/weekly-activity/",
  AuthMiddleware,
  isGuruOnly,
  memoryUpload.array("foto", 20),
  createWeeklyActivityController
);

// Get WeeklyActivity by idKelas
router.get(
  "/weekly-activity",
  AuthMiddleware,
  getWeeklyActivityByIdKelasController
);

// Get WeeklyActivity by idKelas
router.get(
  "/weekly-activity-guru/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getWeeklyActivityByIdKelasGuruController
);

// Delete WeeklyActivity
router.delete(
  "/weekly-activity/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteWeeklyActivityController
);

export default router;
