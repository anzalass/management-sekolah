import express from "express";
const router = express.Router();


import {
  createGuruTemplateController,
  deletedGuruTemplateController,
  getAllGuruTemplateController,
  getGuruTemplateByIdController,
  updateGuruTemplateController

} from "../controller/guruTemplateController.js"; 
import { AuthMiddleware } from "../utils/authMiddleware.js";

router.post("/guru-template/create", AuthMiddleware,createGuruTemplateController);
router.get("/guru-template", getAllGuruTemplateController);
router.get("/guru-template/:id", getGuruTemplateByIdController);
router.put("/guru-template/update/:id",AuthMiddleware ,updateGuruTemplateController);
router.delete("/guru-template/:id", AuthMiddleware,deletedGuruTemplateController);


export default router;