import { Router } from "express";
import * as siswaController from "../../controller/siswa/siswaController.js";
import { AuthMiddleware } from "../../utils/authMiddleware.js";

const router = Router();

// Semua endpoint berdasarkan idSiswa
router.get(
  "/pembayaran-siswa",
  AuthMiddleware,
  siswaController.getPembayaranRiwayatPembayaran
);
router.get("/siswa/kelas", AuthMiddleware, siswaController.getKelas);
router.get("/siswa/kelas-mapel", AuthMiddleware, siswaController.getKelasMapel);
router.get("/siswa/presensi", AuthMiddleware, siswaController.getPresensi);
router.get("/siswa/perizinan", AuthMiddleware, siswaController.getPerizinan);
router.get(
  "/siswa/pengumuman",
  AuthMiddleware,
  siswaController.getPengumumanSiswa
);
router.get("/siswa/rapot", AuthMiddleware, siswaController.getRapot);
router.get(
  "/siswa/pelanggaran",
  AuthMiddleware,
  siswaController.getPelanggaran
);
router.get("/siswa/prestasi", AuthMiddleware, siswaController.getPrestasi);
router.get("/siswa", AuthMiddleware, siswaController.getDashboardSiswa);
router.get("/siswa/nilai", AuthMiddleware, siswaController.getNilaiSiswa);

export default router;
