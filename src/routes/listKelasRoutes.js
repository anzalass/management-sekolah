import express from "express";
import {
  createListKelasController,
  deleteListKelasController,
  getAllListKelasController,
  getAllListKelasInputController,
} from "../controller/listKelasController.js";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";

const router = express.Router();

router.post(
  "/list-kelas",
  AuthMiddleware,
  isGuruOnly,
  createListKelasController
); // Create
router.delete(
  "/list-kelas/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteListKelasController
); // Delete
router.get(
  "/list-kelas",
  AuthMiddleware,
  isGuruOnly,
  getAllListKelasController
); // Get All
router.get("/list-kelas-input", getAllListKelasInputController); // Get All

export default router;
