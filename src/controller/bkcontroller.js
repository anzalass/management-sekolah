import {
  createKonseling,
  createPelanggaranPrestasi,
  deleteKonseling,
  deletePelanggaranPrestasi,
  getAllKonseling,
  getKonselingById,
  getPelanggaranPrestasiById,
  getPelanggaranPrestasiList,
  updateKonseling,
  updatePelanggaranPrestasi,
} from "../services/bkservice.js";

const tipeController = "konseling / pelanggaran, prestasi";

export const createKonselingController = async (req, res) => {
  try {
    await createKonseling(req.body);
    return res
      .status(201)
      .json({ message: `Berhasil membuat ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getByIdKonselingController = async (req, res) => {
  try {
    const result = await getKonselingById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
};

export const updateKonselingController = async (req, res) => {
  try {
    await updateKonseling(req.params.id, req.body);
    return res
      .status(201)
      .json({ message: `Berhasil mengubah ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const removeKonselingController = async (req, res) => {
  try {
    await deleteKonseling(req.params.id);
    return res
      .status(201)
      .json({ message: `Berhasil menghapus ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllKonselingController = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, ...filters } = req.query;

    const result = await getAllKonseling(
      filters,
      Number(page),
      Number(pageSize)
    );

    return res.status(200).json({
      success: true,
      message: "Data konseling berhasil diambil",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createPelanggaranPrestasiController = async (req, res) => {
  try {
    await createPelanggaranPrestasi(req.body);
    return res
      .status(201)
      .json({ message: `Berhasil membuat ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// controller
export const getAllPelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await getPelanggaranPrestasiList({
      nisSiswa: req.query.nis,
      jenis: req.query.jenis,
      namaSiswa: req.query.nama,
      waktu: req.query.waktu,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data pelanggaran & prestasi siswa",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: err.message || "Terjadi kesalahan",
    });
  }
};

export const getByIdPelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await getPelanggaranPrestasiById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updatePelanggaranPrestasiController = async (req, res) => {
  try {
    await updatePelanggaranPrestasi(req.params.id, req.body);
    return res
      .status(201)
      .json({ message: `Berhasil mengubah ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const removePelanggaranPrestasiController = async (req, res) => {
  try {
    await deletePelanggaranPrestasi(req.params.id);
    return res
      .status(201)
      .json({ message: `Berhasil menghapus ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
