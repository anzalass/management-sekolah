import express from "express";
import {
  createRuangController,
  getRuangByIdController,
  updateRuangController,
  deleteRuangController,
  getAllRuangController,
} from "../controller/ruangController.js";

const router = express.Router();

router.post("/ruang/create", createRuangController);
router.get("/ruang/get/:id", getRuangByIdController);
router.put("/ruang/update/:id", updateRuangController);
router.delete("/ruang/delete/:id", deleteRuangController);
router.get("/ruang", getAllRuangController);

export default router;
