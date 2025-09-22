import {
  createListKelas,
  deleteListKelas,
  getAllListKelas,
} from "../services/listKelasService.js";

// Create
export const createListKelasController = async (req, res) => {
  try {
    const { namaKelas } = req.body;
    if (!namaKelas) {
      return res.status(400).json({ message: "namaKelas wajib diisi" });
    }

    const newKelas = await createListKelas(namaKelas);
    return res.status(201).json({
      message: "Kelas berhasil dibuat",
      data: newKelas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Delete
export const deleteListKelasController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteListKelas(id);
    return res.json({ message: "Kelas berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get All
export const getAllListKelasController = async (req, res) => {
  try {
    const kelas = await getAllListKelas({
      namaKelas: req.query.nama,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    return res.json(kelas);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
