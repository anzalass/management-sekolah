import express from "express";
import {
  getAllArsipController,
  createArsipController,
  deleteArsipController,
} from "../controller/arsipController.js";

const router = express.Router();

router.get("/arsip", getAllArsipController);
router.post("/arsip", createArsipController);
router.delete("/arsip/:id", deleteArsipController);

export default router;
