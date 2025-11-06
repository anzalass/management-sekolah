import express from "express";
import { AuthMiddleware, isGuruOnly } from "../utils/authMiddleware.js";
import {
  createMataPelajaranController,
  deleteMataPelajaranController,
  getAllMataPelajaranController,
  getAllMataPelajaranInputController,
  getMataPelajaranByIdController,
  updateMataPelajaranController,
} from "../controller/mataPelajaranController.js";

const router = express.Router();

router.post(
  "/mapel/create",
  AuthMiddleware,
  isGuruOnly,
  createMataPelajaranController
);
router.get(
  "/mapel/get/:id",
  AuthMiddleware,
  isGuruOnly,
  getMataPelajaranByIdController
);
router.put(
  "/mapel/update/:id",
  AuthMiddleware,
  isGuruOnly,
  updateMataPelajaranController
);
router.delete(
  "/mapel/delete/:id",
  AuthMiddleware,
  isGuruOnly,
  deleteMataPelajaranController
);
router.get("/mapel", AuthMiddleware, isGuruOnly, getAllMataPelajaranController);
router.get(
  "/mapel-input",
  AuthMiddleware,
  isGuruOnly,
  getAllMataPelajaranInputController
);

export default router;
