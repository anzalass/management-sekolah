import express from "express";
const router = express.Router();

import {
  createPendaftaranController,
  getPendaftaranByIdController,
  getAllPendaftaranController,
  updatePendaftaranController,
  deletePendaftaranController,
} from "../controller/pendaftaranController.js"; // Adjust path as needed
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

router.post(
  "/pendaftaran/",
  AuthMiddleware,
  isKepalaSekolah,
  createPendaftaranController
);
router.get(
  "/pendaftaran",
  AuthMiddleware,
  isKepalaSekolah,
  getAllPendaftaranController
);
router.get(
  "/pendaftaran/:id",
  AuthMiddleware,
  isKepalaSekolah,
  getPendaftaranByIdController
);
router.put(
  "/pendaftaran/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updatePendaftaranController
);
router.delete(
  "/pendaftaran/delete/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deletePendaftaranController
);

export default router;
