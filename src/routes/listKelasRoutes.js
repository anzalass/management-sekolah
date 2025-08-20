import express from "express";
import {
  createListKelasController,
  deleteListKelasController,
  getAllListKelasController,
} from "../controller/listKelasController.js";

const router = express.Router();

router.post("/list-kelas", createListKelasController); // Create
router.delete("/list-kelas/:id", deleteListKelasController); // Delete
router.get("/list-kelas", getAllListKelasController); // Get All

export default router;
