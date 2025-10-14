import express from "express";
import {
  createRuangController,
  getRuangByIdController,
  updateRuangController,
  deleteRuangController,
  getAllRuangController,
  getAllRuangController2,
} from "../controller/ruangController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/ruang/create",
  AuthMiddleware,
  isKepalaSekolah,
  createRuangController
);
router.get(
  "/ruang/get/:id",
  AuthMiddleware,
  isKepalaSekolah,
  getRuangByIdController
);
router.put(
  "/ruang/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updateRuangController
);
router.delete(
  "/ruang/delete/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteRuangController
);
router.get("/ruang", AuthMiddleware, isKepalaSekolah, getAllRuangController);
router.get("/ruang2", AuthMiddleware, getAllRuangController2);

export default router;
