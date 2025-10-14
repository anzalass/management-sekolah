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
  handleGetMateriAndSummaryByMateriIdSiswa,
  handleGetMateriMapelById,
  handleGetSummaryByMateriId,
  handleGetSummaryByTugasId,
  handleGetSummaryMateriById,
  handleGetSummaryTugasById,
  handleGetTugasAndSummaryByTugasIdSiswa,
  handleGetTugasAndSummaryByTugasiID,
  handleGetTugasMapelById,
  handleUpdateMateriMapel,
  handleUpdateTugasMapel,
} from "../controller/materiTugasSummaryController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
import memoryUpload from "../utils/multer.js";

const router = express.Router();

// Materi Mapel
router.post("/materi", AuthMiddleware, isGuruOnly, handleCreateMateriMapel);
router.get("/materi", AuthMiddleware, isGuruOnly, handleGetAllMateriMapel);
router.get("/materi/:id", AuthMiddleware, isGuruOnly, handleGetMateriMapelById);
router.delete(
  "/materi/:id",
  AuthMiddleware,
  isGuruOnly,
  handleDeleteMateriMapel
);
router.put("/materi/:id", AuthMiddleware, isGuruOnly, handleUpdateMateriMapel);

router.post("/tugas", AuthMiddleware, isGuruOnly, handleCreateTugasMapel);
router.get("/tugas", AuthMiddleware, isGuruOnly, handleGetAllTugasMapel);
router.get("/tugas/:id", AuthMiddleware, isGuruOnly, handleGetTugasMapelById);
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
router.get(
  "/materi-summary-siswa/:idMateri",
  AuthMiddleware,
  handleGetMateriAndSummaryByMateriIdSiswa
);
router.get(
  "/tugas-summary-siswa/:idTugas",
  AuthMiddleware,
  handleGetTugasAndSummaryByTugasIdSiswa
);

export default router;
