import {
  createMataPelajaran,
  deleteMataPelajaran,
  getAllMataPelajaran,
  getMataPelajaranById,
  updateMataPelajaran,
} from "../services/mataPelajaranService.js";

export const createMataPelajaranController = async (req, res) => {
  try {
    const { nama, kelas } = req.body;
    const guruId = req.user.idGuru; // ✅ karena dari JWT pakai `guruId`

    if (!guruId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak, guruId tidak ditemukan di token" });
    }

    const result = await createMataPelajaran({
      nama,
      kelas,
      guruId,
    });

    return res.status(201).json({
      message: "Berhasil membuat mata pelajaran",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat mata pelajaran",
      error: error.message,
    });
  }
};

export const updateMataPelajaranController = async (req, res, next) => {
  try {
    await updateMataPelajaran(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMataPelajaranController = async (req, res, next) => {
  try {
    await deleteMataPelajaran(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMataPelajaranByIdController = async (req, res, next) => {
  try {
    const mataPelajaran = await getMataPelajaranById(req.params.id);
    return res.status(200).json({
      message: "Berhasil mendapatkan mata pelajaran",
      data: mataPelajaran,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllMataPelajaranController = async (req, res, next) => {
  try {
    const result = await getAllMataPelajaran({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama,
    });
    return res.status(200).json({
      message: "Berhasil mendapatkan semua mata pelajaran",
      result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
