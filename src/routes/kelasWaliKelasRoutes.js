import express from "express";
import {
  addSiswatoKelasWaliKelasController,
  createKelasWaliKelasController,
  deleteKelasWaliKelasController,
  deleteSiswatoKelasWaliKelasController,
  getKelasWaliKelasByIdController,
  updateKelasWaliKelasController,
} from "../controller/kelasWalikelasController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";
const router = express.Router();

router.post(
  "/kelas-walikelas/create",
  AuthMiddleware,
  createKelasWaliKelasController
);
router.put("/kelas-walikelas/update/:id", updateKelasWaliKelasController);
router.delete("/kelas-walikelas/delete/:id", deleteKelasWaliKelasController);
router.get("/kelas-walikelas/get/:id", getKelasWaliKelasByIdController);
router.post("/kelas-walikelas/add", addSiswatoKelasWaliKelasController);
router.post(
  "/kelas-walikelas/remove/:id",
  deleteSiswatoKelasWaliKelasController
);

export default router;
