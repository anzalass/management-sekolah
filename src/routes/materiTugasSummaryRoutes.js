import express from "express";
import {
  handleCreateMateriMapel,
  handleCreateSummaryMateri,
  handleCreateSummaryTugas,
  handleCreateTugasMapel,
  handleDeleteMateriMapel,
  handleDeleteSummaryMateri,
  handleDeleteSummaryTugas,
  handleDeleteTugasMapel,
  handleGetAllMateriMapel,
  handleGetAllSummaryMateri,
  handleGetAllSummaryTugas,
  handleGetAllTugasMapel,
  handleGetMateriAndSummaryByMateriID,
  handleGetMateriMapelById,
  handleGetSummaryByMateriId,
  handleGetSummaryByTugasId,
  handleGetSummaryMateriById,
  handleGetSummaryTugasById,
  handleGetTugasAndSummaryByTugasiID,
  handleGetTugasMapelById,
  handleUpdateMateriMapel,
  handleUpdateTugasMapel,
} from "../controller/materiTugasSummaryController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import memoryUpload from "../utils/multer.js";

const router = express.Router();

// Materi Mapel
router.post("/materi", AuthMiddleware, handleCreateMateriMapel);
router.get("/materi", handleGetAllMateriMapel);
router.get("/materi/:id", handleGetMateriMapelById);
router.delete("/materi/:id", handleDeleteMateriMapel);
router.put("/materi/:id", handleUpdateMateriMapel);

router.post("/tugas", AuthMiddleware, handleCreateTugasMapel);
router.get("/tugas", handleGetAllTugasMapel);
router.get("/tugas/:id", handleGetTugasMapelById);
router.delete("/tugas/:id", handleDeleteTugasMapel);
router.put("/tugas/:id", handleUpdateTugasMapel);

// Summary Materi
router.post(
  "/summary",
  memoryUpload.array("foto", 5),
  handleCreateSummaryMateri
);
router.get("/summary", handleGetAllSummaryMateri);
router.get("/summary/:id", handleGetSummaryMateriById);
router.delete("/summary/:id", handleDeleteSummaryMateri);
router.get("/summary/materi/:idMateri", handleGetSummaryByMateriId);

// Summary Tugas
router.post(
  "/summary-tugas",
  memoryUpload.array("foto", 5),
  handleCreateSummaryTugas
);
router.get("/summary-tugas", handleGetAllSummaryTugas);
router.get("/summary-tugas/:id", handleGetSummaryTugasById);
router.delete("/summary-tugas/:id", handleDeleteSummaryTugas);
router.get("/summary-tugas/materi/:idTugas", handleGetSummaryByTugasId);

router.get("/materi-summary/:id", handleGetMateriAndSummaryByMateriID);
router.get("/tugas-summary/:id", handleGetTugasAndSummaryByTugasiID);

export default router;
