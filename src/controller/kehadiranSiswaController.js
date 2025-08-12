import {
  createKehadiranSiswa,
  deleteKehadiranSiswa,
  getAbsensiTableByKelas,
  getRekapAbsensiByKelas,
  getSiswaByKelasWithKehadiranHariIni,
  updateKeteranganKehadiran,
} from "../services/kehadiranSiswa.js";

export const createKehadiranHandler = async (req, res) => {
  try {
    const data = req.body;
    const result = await createKehadiranSiswa(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteKehadiranHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteKehadiranSiswa(id);
    res
      .status(200)
      .json({ message: "Kehadiran berhasil dihapus", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSiswaByKelasWithKehadiranHariIniHandler = async (req, res) => {
  try {
    const siswaList = await getSiswaByKelasWithKehadiranHariIni(
      req.params.idKelas
    );
    res.status(200).json({ data: siswaList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateKeteranganHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { keterangan } = req.body;
    const updated = await updateKeteranganKehadiran(id, keterangan);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAbsensiByKelas = async (req, res) => {
  const { idKelas } = req.params;

  if (!idKelas) {
    return res.status(400).json({ message: "idKelas wajib diisi" });
  }

  try {
    const data = await getAbsensiTableByKelas(idKelas);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error getAbsensiByKelas:", error);
    return res.status(500).json({ message: "Gagal mengambil data absensi" });
  }
};

export const getRekapAbsensiByKelasController = async (req, res) => {
  const { idKelas } = req.params;

  if (!idKelas) {
    return res.status(400).json({ message: "idKelas wajib diisi" });
  }

  try {
    const data = await getRekapAbsensiByKelas(idKelas);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error getAbsensiByKelas:", error);
    return res.status(500).json({ message: "Gagal mengambil data absensi" });
  }
};
