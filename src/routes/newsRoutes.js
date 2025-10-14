import express from "express";
const router = express.Router();

import {
  createNewsController,
  getNewsByIdController,
  getAllNewsController,
  updateNewsController,
  deleteNewsController,
} from "../controller/newsController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

router.post(
  "/news/create",
  AuthMiddleware,
  isKepalaSekolah,
  createNewsController
);
router.get("/news", getAllNewsController);
router.get("/news/:id", getNewsByIdController);
router.put(
  "/news/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updateNewsController
);
router.delete(
  "/news/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteNewsController
);

export default router;
