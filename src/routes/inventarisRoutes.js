import express from "express";
import { AuthMiddleware, hasRole } from "../utils/authMiddleware.js";
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
  getAllInventarisDistinctController,
} from "../controller/inventartisController.js";

const router = express.Router();

router.post(
  "/inventaris/create",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Sarpras"),
  createInventarisController
);
router.get(
  "/inventaris/get/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getInventarisByIdController
);
router.put(
  "/inventaris/update/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  updateInventarisController
);
router.delete(
  "/inventaris/delete/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  deleteInventarisController
);
router.get(
  "/inventaris",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getAllInventarisController
);

router.get(
  "/daftar-inventaris",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getAllInventarisDistinctController
);

router.post(
  "/jenis-inventaris/create",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  createJenisInventarisController
);
router.get(
  "/jenis-inventaris/get/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getJenisInventarisByIdController
);
router.put(
  "/jenis-inventaris/update/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  updateJenisInventarisController
);
router.delete(
  "/jenis-inventaris/delete/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  deleteJenisInventarisController
);
router.get(
  "/jenis-inventaris",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getAllJenisInventarisController
);

router.get(
  "/jenis-inventaris2",
  // hasRole("Kepala Sekolah", "Sarpras"),
  getAllJenisInventarisController2
);

router.get(
  "/daftar-inventaris",
  AuthMiddleware,
  
  getAllInventarisDistinctController
);

router.post(
  "/pemeliharaan-inventaris/create",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  createPemeliharaanInventarisController
);
router.get(
  "/pemeliharaan-inventaris/get/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getPemeliharaanInventarisByIdController
);
router.put(
  "/pemeliharaan-inventaris/update/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  updatePemeliharaanInventarisController
);
router.delete(
  "/pemeliharaan-inventaris/delete/:id",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  deletePemeliharaanInventarisController
);
router.get(
  "/pemeliharaan-inventaris",
  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  getAllPemeliharaanInventarisController
);

router.put(
  "/pemeliharaan-inventaris/update-status/:id",

  AuthMiddleware,

  hasRole("Kepala Sekolah", "Sarpras"),
  updateStatusPemeliharaanController
);

export default router;
