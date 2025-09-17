import {
  createKehadiranSiswa,
  createKehadiranSiswaManual,
  deleteKehadiranSiswa,
  getAbsensiTableByKelas,
  getAbsesniSiswaByKelas,
  getRekapAbsensiByKelas,
  getSiswaByKelasWithKehadiranHariIni,
  updateKeteranganKehadiran,
} from "../services/kehadiranSiswa.js";

export const createKehadiranHandler = async (req, res) => {
  try {
    const data = req.body;
    const result = await createKehadiranSiswa(data);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createKehadiranManualHandler = async (req, res) => {
  try {
    const data = req.body;
    const result = await createKehadiranSiswaManual(data);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteKehadiranHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteKehadiranSiswa(id);
    return res
      .status(200)
      .json({ message: "Kehadiran berhasil dihapus", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getSiswaByKelasWithKehadiranHariIniHandler = async (req, res) => {
  try {
    const siswaList = await getSiswaByKelasWithKehadiranHariIni(
      req.params.idKelas
    );
    return res.status(200).json({ data: siswaList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateKeteranganHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { keterangan } = req.body;
    const updated = await updateKeteranganKehadiran(id, keterangan);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAbsensiSiswaByKelasController = async (req, res) => {
  const idKelas = req.params.idKelas;
  const idSiswa = req.params.idSiswa;
  try {
    const data = await getAbsesniSiswaByKelas(idSiswa, idKelas);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
