import express from "express";
import {
  BayarTagihanManualController,
  bayarTagihanMidtransController,
  buktiTidakValidController,
  CreateTagihanController,
  DeleteTagihanController,
  GetAllRiwayatPembayaranController,
  GetAllTagihanController,
  GetTagihanByIdController,
  midtransNotificationController,
  UpdateTagihanController,
  uploadBuktiTagihanController,
} from "../controller/pembayaranController.js";

const router = express.Router();

router.get("/pembayaran/", GetAllTagihanController);
router.get("/pembayaran/:id", GetTagihanByIdController);
router.post("/pembayaran/", CreateTagihanController);
router.put("/pembayaran/:id", UpdateTagihanController);
router.delete("/pembayaran/:id", DeleteTagihanController);
router.post("/bayar-tagihan/:id", BayarTagihanManualController);
router.get("/riwayat-pembayaran", GetAllRiwayatPembayaranController);
router.post("/bayar-midtrans/:idTagihan", bayarTagihanMidtransController);
router.post("/midtrans/notif", midtransNotificationController);
router.patch("/pembayaran-upload-bukti/:id", uploadBuktiTagihanController);
router.patch("/pembayaran-bukti-tidak-valid/:id", buktiTidakValidController);

export default router;
