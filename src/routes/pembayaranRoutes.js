import express from "express";
import {
  CreateTagihanController,
  DeleteTagihanController,
  GetAllTagihanController,
  GetTagihanByIdController,
  UpdateTagihanController,
} from "../controller/pembayaranController.js";

const router = express.Router();

router.get("/pembayaran/", GetAllTagihanController);
router.get("/pembayaran/:id", GetTagihanByIdController);
router.post("/pembayaran/", CreateTagihanController);
router.put("/pembayaran/:id", UpdateTagihanController);
router.delete("/pembayaran/:id", DeleteTagihanController);

export default router;
