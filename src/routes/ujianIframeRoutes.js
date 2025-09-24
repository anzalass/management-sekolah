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
} from "../controller/ujianIframeController.js";

const router = Router();

// CREATE
router.post("/ujian-iframe", createUjianIframe);

// GET ALL
router.get("/ujian-iframe/", getAllUjianIframe);

// GET BY ID
router.get("/ujian-iframe/:id", getUjianIframeById);
router.get("/ujian-iframe-guru/:id", getUjianIframeByIdGuru);

// GET BY ID KELASMAPEL
router.get("/ujian-iframe/kelas/:idKelasMapel", getUjianIframeByKelasMapel);

// UPDATE
router.put("/ujian-iframe/:id", updateUjianIframe);

// DELETE
router.delete("/ujian-iframe/:id", deleteUjianIframe);
router.post("/ujian-iframe-selesai", selesaiUjianController);
router.post("/get-ujian-iframe-selesai", getSelesaiUjianController);
router.delete("/selesai-ujian/delete/:id", deleteSelesaiUjianController);
export default router;
