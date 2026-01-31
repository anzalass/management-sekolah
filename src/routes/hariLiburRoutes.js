import express from "express";
import {
  createHariLiburController,
  updateHariLiburController,
  deleteHariLiburController,
  getHariLiburByIdController,
  getHariLiburPaginatedController,
} from "../controller/hariLiburController.js";
import { AuthMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

/**
 * =========================
 * HARI LIBUR ROUTES
 * =========================
 */

// GET ALL + PAGINATION + FILTER
router.get("/hari-libur", AuthMiddleware, getHariLiburPaginatedController);

// GET BY ID
router.get("/hari-libur/:id", AuthMiddleware, getHariLiburByIdController);

// CREATE
router.post("/hari-libur", AuthMiddleware, createHariLiburController);

// UPDATE
router.put("/hari-libur/:id", AuthMiddleware, updateHariLiburController);

// DELETE
router.delete("/hari-libur/:id", AuthMiddleware, deleteHariLiburController);

export default router;
