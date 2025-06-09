import express from "express";
const router = express.Router();


import {
  createGalleryController,
  deletedGalleryController,
  getAllGalleryController,
  getGalleryByIdController,
  updateGalleryController
  

} from "../controller/galleryController.js"; 
import { AuthMiddleware } from "../utils/authMiddleware.js";

router.post("/gallery/create", AuthMiddleware,createGalleryController);
router.get("/gallery", getAllGalleryController);
router.get("/gallery/:id", getGalleryByIdController);
router.put("/gallery/update/:id",AuthMiddleware ,updateGalleryController);
router.delete("/gallery/:id",AuthMiddleware ,deletedGalleryController);


export default router;