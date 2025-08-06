import express from "express";
import {
  handleCreateMateriMapel,
  handleCreateSummaryMateri,
  handleCreateTugasMapel,
  handleDeleteMateriMapel,
  handleDeleteSummaryMateri,
  handleDeleteTugasMapel,
  handleGetAllMateriMapel,
  handleGetAllSummaryMateri,
  handleGetAllTugasMapel,
  handleGetMateriAndSummaryByMateriID,
  handleGetMateriMapelById,
  handleGetSummaryByMateriId,
  handleGetSummaryMateriById,
  handleGetTugasAndSummaryByTugasiID,
  handleGetTugasMapelById,
} from "../controller/materiTugasSummaryController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// Materi Mapel
router.post("/materi", AuthMiddleware, handleCreateMateriMapel);
router.get("/materi", handleGetAllMateriMapel);
router.get("/materi/:id", handleGetMateriMapelById);
router.delete("/materi/:id", handleDeleteMateriMapel);

router.post("/tugas", AuthMiddleware, handleCreateTugasMapel);
router.get("/tugas", handleGetAllTugasMapel);
router.get("/tugas/:id", handleGetTugasMapelById);
router.delete("/tugas/:id", handleDeleteTugasMapel);

// Summary Materi
router.post("/summary", handleCreateSummaryMateri);
router.get("/summary", handleGetAllSummaryMateri);
router.get("/summary/:id", handleGetSummaryMateriById);
router.delete("/summary/:id", handleDeleteSummaryMateri);
router.get("/summary/materi/:idMateri", handleGetSummaryByMateriId);

router.get("/materi-summary/:id", handleGetMateriAndSummaryByMateriID);
router.get("/tugas-summary/:id", handleGetTugasAndSummaryByTugasiID);

export default router;
