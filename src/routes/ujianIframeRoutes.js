import { Router } from "express";
import {
  createUjianIframe,
  getAllUjianIframe,
  getUjianIframeById,
  getUjianIframeByKelasMapel,
  updateUjianIframe,
  deleteUjianIframe,
} from "../controller/ujianIframeController.js";

const router = Router();

// CREATE
router.post("/ujian-iframe", createUjianIframe);

// GET ALL
router.get("/ujian-iframe/", getAllUjianIframe);

// GET BY ID
router.get("/ujian-iframe/:id", getUjianIframeById);

// GET BY ID KELASMAPEL
router.get("/ujian-iframe/kelas/:idKelasMapel", getUjianIframeByKelasMapel);

// UPDATE
router.put("/ujian-iframe/:id", updateUjianIframe);

// DELETE
router.delete("/ujian-iframe/:id", deleteUjianIframe);

export default router;
