import express from "express";
import {
  getDashboardMengajar,
  getDashboardOverview,
} from "../controller/pageController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-mengajar", AuthMiddleware, getDashboardMengajar);
router.get("/dashboard-overview", AuthMiddleware, getDashboardOverview);

export default router;
