// routes/janjiTemuRoutes.ts
import { Router } from "express";
import {
  createJanjiTemuController,
  getAllJanjiTemuController,
  getJanjiTemuByIdController,
  getJanjiTemuByIdSiswaController,
  getJanjiTemuByIdGuruController,
  updateJanjiTemuController,
  deleteJanjiTemuController,
  updateStatusJanjiTemuController,
} from "../../controller/siswa/janjiTemuController.js";
import { AuthMiddleware } from "../../utils/authMiddleware.js";

const router = Router();

// CREATE
router.post("/janji-temu", AuthMiddleware, createJanjiTemuController);

// READ
router.get("/janji-temu", AuthMiddleware, getAllJanjiTemuController);
router.get("/janji-temu/:id", AuthMiddleware, getJanjiTemuByIdController);

// READ khusus user (ambil dari token/req.user)
router.get(
  "/janji-temu-siswa",
  AuthMiddleware,
  getJanjiTemuByIdSiswaController
);
router.get("/janji-temu-guru", AuthMiddleware, getJanjiTemuByIdGuruController);

// UPDATE
router.put("/janji-temu/:id", AuthMiddleware, updateJanjiTemuController);
router.put(
  "/janji-temu-status/:id",
  AuthMiddleware,
  updateStatusJanjiTemuController
);

// DELETE
router.delete("/janji-temu/:id", AuthMiddleware, deleteJanjiTemuController);

export default router;
