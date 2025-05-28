import express from "express";
import { AuthMiddleware } from "../utils/authMiddleware.js";
import {
  createInventarisController,
  deleteInventarisController,
  getInventarisByIdController,
  updateInventarisController,
  getAllInventarisController,
  getAllJenisInventarisController2,
  createJenisInventarisController,
  updateJenisInventarisController,
  deleteJenisInventarisController,
  getJenisInventarisByIdController,
  getAllJenisInventarisController,
  createPemeliharaanInventarisController,
  updatePemeliharaanInventarisController,
  deletePemeliharaanInventarisController,
  getPemeliharaanInventarisByIdController,
  getAllPemeliharaanInventarisController,
  updateStatusPemeliharaanController,
} from "../controller/inventartisController.js";

const router = express.Router();

router.post("/inventaris/create", createInventarisController);
router.get("/inventaris/get/:id", getInventarisByIdController);
router.put("/inventaris/update/:id", updateInventarisController);
router.delete("/inventaris/delete/:id", deleteInventarisController);
router.get("/inventaris", getAllInventarisController);

router.post("/jenis-inventaris/create", createJenisInventarisController);
router.get("/jenis-inventaris/get/:id", getJenisInventarisByIdController);
router.put("/jenis-inventaris/update/:id", updateJenisInventarisController);
router.delete("/jenis-inventaris/delete/:id", deleteJenisInventarisController);
router.get("/jenis-inventaris", getAllJenisInventarisController);

router.get("/jenis-inventaris2", getAllJenisInventarisController2);

router.post(
  "/pemeliharaan-inventaris/create",
  createPemeliharaanInventarisController
);
router.get(
  "/pemeliharaan-inventaris/get/:id",
  getPemeliharaanInventarisByIdController
);
router.put(
  "/pemeliharaan-inventaris/update/:id",
  updatePemeliharaanInventarisController
);
router.delete(
  "/pemeliharaan-inventaris/delete/:id",
  deletePemeliharaanInventarisController
);
router.get("/pemeliharaan-inventaris", getAllPemeliharaanInventarisController);

router.put(
  "/pemeliharaan-inventaris/update-status/:id",
  updateStatusPemeliharaanController
);

export default router;
