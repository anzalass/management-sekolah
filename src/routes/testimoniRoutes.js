import express from "express";
const router = express.Router();


import {
  createTestimoniController,
  getAllTestimoniController,
  getTestimoniByIdController,
  deleteTestimoniController,
  updateTestimoniController
} from "../controller/testimoniController.js"; 
import { AuthMiddleware } from "../utils/authMiddleware.js";


router.post("/testimonials/create",AuthMiddleware ,createTestimoniController);
router.get("/testimonials", getAllTestimoniController);
router.get("/testimonials/:id", getTestimoniByIdController);
router.delete("/testimonials/:id",AuthMiddleware ,deleteTestimoniController);
router.put("/testimonials/update/:id",AuthMiddleware ,updateTestimoniController);


export default router;
