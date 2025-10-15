import { Router } from "express";
import {
  createUjianIframe,
  getAllUjianIframe,
  getUjianIframeById,
  getUjianIframeByKelasMapel,
  updateUjianIframe,
  deleteUjianIframe,
  selesaiUjianController,
  getSelesaiUjianController,
  getUjianIframeByIdGuru,
  deleteSelesaiUjianController,
  proxyUjian,
  sedangBerlangsungUjianController,
} from "../controller/ujianIframeController.js";
import {
  AuthMiddleware,
  isGuruOnly,
  isSiswa,
} from "../utils/authMiddleware.js";

const router = Router();

router.post("/ujian-iframe", AuthMiddleware, isGuruOnly, createUjianIframe);

router.get("/ujian-iframe", AuthMiddleware, isGuruOnly, getAllUjianIframe);

// GET BY ID
router.get("/ujian-iframe/:id", AuthMiddleware, getUjianIframeById);
router.get(
  "/ujian-iframe-guru/:id",
  AuthMiddleware,
  isGuruOnly,
  getUjianIframeByIdGuru
);

// GET BY ID KELASMAPEL
router.get(
  "/ujian-iframe/kelas/:idKelasMapel",
  AuthMiddleware,
  getUjianIframeByKelasMapel
);

router.get("/ujian-proxy/:id", proxyUjian);

// UPDATE
router.put("/ujian-iframe/:id", AuthMiddleware, isGuruOnly, updateUjianIframe);

// DELETE
router.delete("/ujian-iframe/:id", isGuruOnly, deleteUjianIframe);
router.post("/ujian-iframe-selesai", selesaiUjianController);
router.post(
  "/ujian-iframe-berlangsung",
  AuthMiddleware,
  sedangBerlangsungUjianController
);

router.post(
  "/get-ujian-iframe-selesai",
  AuthMiddleware,
  isSiswa,
  getSelesaiUjianController
);
router.delete(
  "/selesai-ujian/delete/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteSelesaiUjianController
);
export default router;
