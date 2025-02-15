import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createInventarisController,
  deleteInventarisController,
  getInventarisByIdController,
  updateInventarisController,
} from "../controller/inventartisController.js";

const router = express.Router();

router.post("/inventaris/create", createInventarisController);
router.get("/inventaris/get/:id", getInventarisByIdController);
router.put("/inventaris/update/:id", updateInventarisController);
router.delete("/inventaris/delete/:id", deleteInventarisController);

export default router;
