import {
  getNotifikasiByIDPengguna,
  updateStatusAndDeleteSiswa,
  updateStatusAndDeleteGuru,
  getNotifikasiByIDPenggunaTotal,
} from "../services/notifikasiService.js"; // sesuaikan path service kamu

// ✅ Ambil notifikasi berdasarkan ID pengguna
export const getNotifikasiController = async (req, res) => {
  try {
    const { idGuru } = req.user; // id pengguna (siswa/guru)
    if (!idGuru) {
      return res.status(400).json({ message: "ID pengguna wajib diisi" });
    }

    const notifikasi = await getNotifikasiByIDPengguna(idGuru);
    return res.status(200).json({
      success: true,
      data: notifikasi,
    });
  } catch (error) {
    console.error("Error getNotifikasiController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil data notifikasi",
    });
  }
};

// ✅ Ambil notifikasi berdasarkan ID pengguna
export const getNotifikasiControllerTotal = async (req, res) => {
  try {
    const { idGuru } = req.user; // id pengguna (siswa/guru)
    if (!idGuru) {
      return res.status(400).json({ message: "ID pengguna wajib diisi" });
    }

    const notifikasi = await getNotifikasiByIDPenggunaTotal(idGuru);
    return res.status(200).json({
      success: true,
      data: notifikasi,
    });
  } catch (error) {
    console.error("Error getNotifikasiController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil data notifikasi",
    });
  }
};

// ✅ Update status notifikasi siswa jadi "Terbaca" & hapus yg > 2 minggu
export const updateStatusSiswaController = async (req, res) => {
  try {
    const { idGuru } = req.user;
    if (!idGuru) {
      return res.status(400).json({ message: "ID siswa wajib diisi" });
    }

    await updateStatusAndDeleteSiswa(idGuru);
    return res.status(200).json({
      success: true,
      message: "Status notifikasi siswa diperbarui & notifikasi lama dihapus",
    });
  } catch (error) {
    console.error("Error updateStatusSiswaController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal update notifikasi siswa",
    });
  }
};

// ✅ Update status notifikasi guru jadi "Terbaca" & hapus yg > 2 minggu
export const updateStatusGuruController = async (req, res) => {
  try {
    const { idGuru } = req.user;
    if (!idGuru) {
      return res.status(400).json({ message: "ID guru wajib diisi" });
    }

    await updateStatusAndDeleteGuru(idGuru);
    return res.status(200).json({
      success: true,
      message: "Status notifikasi guru diperbarui & notifikasi lama dihapus",
    });
  } catch (error) {
    console.error("Error updateStatusGuruController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal update notifikasi guru",
    });
  }
};
