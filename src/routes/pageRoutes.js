import express from "express";
import {
  getDashboardKelasMapel,
  getDashboardMengajar,
  getDashboardOverview,
  getDashboardWaliKelas,
  getSidebarMengajar,
} from "../controller/pageController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-mengajar", AuthMiddleware, getDashboardMengajar);
router.get("/dashboard-overview", AuthMiddleware, getDashboardOverview);
router.get(
  "/dashboard-kelas-mapel/:idKelas",
  AuthMiddleware,
  getDashboardKelasMapel
);

router.get(
  "/dashboard-walikelas/:idKelas",
  AuthMiddleware,
  getDashboardWaliKelas
);

router.get("/sidebar", AuthMiddleware, getSidebarMengajar);

export default router;
