import {
  createPendaftaran,
  deletePendaftaran,
  getAllPendaftaran,
  getPendaftaranById,
  updatePendaftaran,
} from "../services/pendaftaranService.js";

export const createPendaftaranController = async (req, res) => {
  try {
    const {
      studentName,
      parentName,
      email,
      birthDay,
      phoneNumber,
      yourLocation,
      kategori,
    } = req.body;

    await createPendaftaran({
      studentName,
      parentName,
      email,
      birthDay,
      phoneNumber,
      yourLocation,
      kategori,
    });

    return res
      .status(201)
      .json({ message: "Pendaftaran berhasil dibuat", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllPendaftaranController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const pendaftaran = await getAllPendaftaran(page, pageSize, search);
    return res.status(200).json({
      data: pendaftaran.data,
      total: pendaftaran.total,
      page: pendaftaran.page,
      pageSize: pendaftaran.pageSize,
      totalPages: pendaftaran.totalPages,
    });
  } catch (error) {
    console.error("Error fetching pendaftaran:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPendaftaranByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const pendaftaran = await getPendaftaranById(id);

    if (!pendaftaran) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan" });
    }

    return res.status(200).json({ data: pendaftaran, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updatePendaftaranController = async (req, res) => {
  const { id } = req.params;

  try {
    const pendaftaran = await getPendaftaranById(id);

    if (!pendaftaran) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan" });
    }

    const { studentName, parentName, email, phoneNumber, yourLocation } =
      req.body;

    await updatePendaftaran(id, {
      studentName,
      parentName,
      email,
      phoneNumber,
      yourLocation,
    });

    return res.status(200).json({
      message: "Pendaftaran berhasil diperbarui",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePendaftaranController = async (req, res) => {
  const { id } = req.params;

  try {
    const pendaftaran = await getPendaftaranById(id);

    if (!pendaftaran) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan" });
    }

    await deletePendaftaran(id);
    return res
      .status(200)
      .json({ message: "Pendaftaran berhasil dihapus", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
