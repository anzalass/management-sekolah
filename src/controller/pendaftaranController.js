import {
  createPendaftaran,
  getAllPendaftaran,
  getPendaftaranById,
} from "../services/pendaftaranService.js";

// Sudah ada sebelumnya
export const handleCreatePendaftaran = async (req, res) => {
  try {
    const data = req.body;
    const newData = await createPendaftaran(data);
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan data", error });
  }
};

export const handleGetAllPendaftaran = async (req, res) => {
  try {
    const {
      page = "1",
      pageSize = "10",
      studentName = "",
      parentName = "",
      email = "",
      yourLocation = "",
    } = req.query;

    const result = await getAllPendaftaran({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      studentName,
      parentName,
      email,
      yourLocation,
    });

    return res.status(200).json({
      success: true,
      message: "Data pendaftaran berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("Get Pendaftaran Error:", error.message);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Terjadi kesalahan saat mengambil data pendaftaran",
    });
  }
};

// 🔹 Tambahan: handle get by ID
export const handleGetPendaftaranById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPendaftaranById(id);

    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};
