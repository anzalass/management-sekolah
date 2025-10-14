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
import { AuthMiddleware, hasRole, isSiswa } from "../utils/authMiddleware.js";

const router = express.Router();

router.get(
  "/pembayaran/",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  GetAllTagihanController
);
router.get(
  "/pembayaran/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  GetTagihanByIdController
);
router.post(
  "/pembayaran/",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  CreateTagihanController
);
router.put(
  "/pembayaran/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  UpdateTagihanController
);
router.delete(
  "/pembayaran/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  DeleteTagihanController
);
router.post(
  "/bayar-tagihan/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  BayarTagihanManualController
);
router.get(
  "/riwayat-pembayaran",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  GetAllRiwayatPembayaranController
);
router.post(
  "/bayar-midtrans/:idTagihan",
  AuthMiddleware,
  isSiswa,
  bayarTagihanMidtransController
);
router.post("/midtrans/notif", midtransNotificationController);
router.patch(
  "/pembayaran-upload-bukti/:id",
  AuthMiddleware,
  isSiswa,
  uploadBuktiTagihanController
);
router.patch(
  "/pembayaran-bukti-tidak-valid/:id",
  AuthMiddleware,
  hasRole("Kepala Sekolah", "Guru TU"),
  buktiTidakValidController
);

export default router;
