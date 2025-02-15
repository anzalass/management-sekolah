import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createRuangKelasController,
  deleteRuangKelasController,
  getRuangKelasByIdController,
  updateRuangKelasController,
} from "../controller/ruangKelasController.js";

const router = express.Router();

router.post("/ruang-kelas/create", createRuangKelasController);
router.get("/ruang-kelas/get/:id", getRuangKelasByIdController);
router.put("/ruang-kelas/update/:id", updateRuangKelasController);
router.delete("/ruang-kelas/delete/:id", deleteRuangKelasController);

export default router;
