import {
  createCatatanAkhirSiswa,
  getAllCatatanAkhirSiswa,
  getCatatanAkhirSiswaById,
  updateCatatanAkhirSiswa,
  deleteCatatanAkhirSiswa,
  getCatatanAkhirSiswaByKelasMapel,
} from "../services/catatanAkhirSiswa.js";

// Create
export const createCatatanAkhirSiswaController = async (req, res) => {
  try {
    const data = await createCatatanAkhirSiswa(req.body, req.user.nama);
    res.status(201).json({
      message: "Catatan akhir siswa berhasil dibuat",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get All
export const getAllCatatanAkhirSiswaController = async (req, res) => {
  try {
    const data = await getAllCatatanAkhirSiswa();
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get By ID
export const getCatatanAkhirSiswaByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getCatatanAkhirSiswaById(id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Update
export const updateCatatanAkhirSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateCatatanAkhirSiswa(id, req.body);
    res.status(200).json({
      message: "Catatan akhir siswa berhasil diperbarui",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Delete
export const deleteCatatanAkhirSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCatatanAkhirSiswa(id);
    res.status(200).json({ message: "Catatan akhir siswa berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get By idKelasMapel
export const getCatatanAkhirSiswaByKelasMapelController = async (req, res) => {
  try {
    const { idKelasMapel } = req.params;
    const data = await getCatatanAkhirSiswaByKelasMapel(idKelasMapel);
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
