import express from "express";
import {
  addSiswatoKelasKelasMapelController,
  createKelasMapelController,
  deleteKelasMapelController,
  getDetailKelasMapelController,
  removeSiswaFromKelasMapelController,
  updateKelasMapelController,
} from "../controller/kelasMapelController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/kelas-mapel/create", AuthMiddleware, createKelasMapelController);
router.put("/kelas-mapel/update/:id", updateKelasMapelController);
router.delete("/kelas-mapel/delete/:id", deleteKelasMapelController);
router.post("/kelas-mapel/add-siswa", addSiswatoKelasKelasMapelController);
router.delete(
  "/kelas-mapel/remove-siswa/:id",
  removeSiswaFromKelasMapelController
);

router.get("/kelas-mapel/:id", AuthMiddleware, getDetailKelasMapelController);

export default router;
