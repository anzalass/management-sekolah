import express from "express";
import {
  getDashboardKelasMapel,
  getDashboardMengajar,
  getDashboardOverview,
  getDashboardWaliKelas,
  getSidebarMengajar,
  perizinanKehadiranByBuru,
} from "../controller/pageController.js";
import {
  AuthMiddleware,
  isGuruOnly,
  isKepalaSekolah,
} from "../utils/authMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard-mengajar",
  AuthMiddleware,
  isGuruOnly,
  getDashboardMengajar
);
router.get(
  "/dashboard-overview",
  AuthMiddleware,
  isKepalaSekolah,
  getDashboardOverview
);
router.get(
  "/dashboard-kelas-mapel/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getDashboardKelasMapel
);

router.get(
  "/dashboard-walikelas/:idKelas",
  AuthMiddleware,
  isGuruOnly,
  getDashboardWaliKelas
);

router.get(
  "/dashboard/perizinan-kehadiran",
  AuthMiddleware,
  isGuruOnly,
  perizinanKehadiranByBuru
);

router.get("/sidebar", AuthMiddleware, isGuruOnly, getSidebarMengajar);

export default router;
