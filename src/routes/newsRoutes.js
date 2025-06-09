import express from "express";
const router = express.Router();


import {
  createNewsController,
  getNewsByIdController,
  getAllNewsController,
  updateNewsController,
  deleteNewsController

} from "../controller/newsController.js"; 
import { AuthMiddleware } from "../utils/authMiddleware.js";

router.post("/news/create",AuthMiddleware ,createNewsController);
router.get("/news", getAllNewsController);
router.get("/news/:id", getNewsByIdController);
router.put("/news/update/:id",AuthMiddleware ,updateNewsController);
router.delete("/news/:id",AuthMiddleware ,deleteNewsController);


export default router;