import express from "express";
import {
  BayarTagihanController,
  CreateTagihanController,
  DeleteTagihanController,
  GetAllRiwayatPembayaranController,
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
router.post("/bayar-tagihan/:id", BayarTagihanController);
router.get("/riwayat-pembayaran", GetAllRiwayatPembayaranController);

export default router;
