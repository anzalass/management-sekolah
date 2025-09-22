import {
  createJadwalPelajaran,
  deleteJadwalPelajaran,
  getJadwalPelajaranByIdKelas,
} from "../services/jadwalPelajaranService.js";

// Create
export const createJadwalPelajaranController = async (req, res) => {
  try {
    const data = req.body;

    // validasi sederhana
    if (
      !data.idKelas ||
      !data.hari ||
      !data.namaMapel ||
      !data.jamMulai ||
      !data.jamSelesai
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const jadwal = await createJadwalPelajaran(data);
    res.status(201).json({ message: "Jadwal berhasil dibuat", data: jadwal });
  } catch (error) {
    res.status(500).json({ message: error.message || "Terjadi kesalahan" });
  }
};

// Delete
export const deleteJadwalPelajaranController = async (req, res) => {
  try {
    const { id } = req.params;

    const jadwal = await deleteJadwalPelajaran(id);
    res.status(200).json({ message: "Jadwal berhasil dihapus", data: jadwal });
  } catch (error) {
    res.status(500).json({ message: error.message || "Terjadi kesalahan" });
  }
};

export const getJadwalPelajaranController = async (req, res) => {
  try {
    const { idKelas } = req.params;

    const jadwal = await getJadwalPelajaranByIdKelas(idKelas);
    res.status(200).json({ message: "Jadwal berhasil dihapus", data: jadwal });
  } catch (error) {
    res.status(500).json({ message: error.message || "Terjadi kesalahan" });
  }
};
