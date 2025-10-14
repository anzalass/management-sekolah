import express from "express";
const router = express.Router();

import {
  createTestimoniController,
  getAllTestimoniController,
  getTestimoniByIdController,
  deleteTestimoniController,
  updateTestimoniController,
} from "../controller/testimoniController.js";
import { AuthMiddleware, isKepalaSekolah } from "../utils/authMiddleware.js";

router.post(
  "/testimonials/create",
  AuthMiddleware,
  isKepalaSekolah,
  createTestimoniController
);
router.get("/testimonials", getAllTestimoniController);
router.get("/testimonials/:id", getTestimoniByIdController);
router.delete(
  "/testimonials/:id",
  AuthMiddleware,
  isKepalaSekolah,
  deleteTestimoniController
);
router.put(
  "/testimonials/update/:id",
  AuthMiddleware,
  isKepalaSekolah,
  updateTestimoniController
);

export default router;
