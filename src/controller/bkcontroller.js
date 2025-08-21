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

export const createKonselingController = async (req, res) => {
  try {
    const result = await createKonseling(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getByIdKonselingController = async (req, res) => {
  try {
    const result = await getKonselingById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateKonselingController = async (req, res) => {
  try {
    const result = await updateKonseling(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeKonselingController = async (req, res) => {
  try {
    const result = await deleteKonseling(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
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

    res.status(200).json({
      success: true,
      message: "Data konseling berhasil diambil",
      ...result,
    });
  } catch (err) {
    console.error(err);
    const errorMessage = prismaErrorHandler(err);
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const createPelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await createPelanggaranPrestasi(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data pelanggaran & prestasi siswa",
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Terjadi kesalahan",
    });
  }
};

export const getByIdPelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await getPelanggaranPrestasiById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updatePelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await updatePelanggaranPrestasi(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removePelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await deletePelanggaranPrestasi(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
