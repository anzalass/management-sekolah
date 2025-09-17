import {
  createInventaris,
  deleteInventaris,
  getInventarisById,
  updateInventaris,
  getAllInventaris,
  createJenisInventaris,
  updateJenisInventaris,
  deleteJenisInventaris,
  getJenisInventarisById,
  getAllJenisInventaris,
  createPemeliharaanInventaris,
  getPemeliharaanInventarisById,
  updatePemeliharaanInventaris,
  deletePemeliharaanInventaris,
  getAllPemeliharaanInventaris,
  updateStatusPemeliharaan,
  getAllInventaris2,
} from "../services/inventarisService.js";

export const createInventarisController = async (req, res) => {
  try {
    await createInventaris(req.body);
    return res.status(201).json({ message: "Berhasil membuat inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateInventarisController = async (req, res) => {
  try {
    await updateInventaris(req.params.id, req.body);
    return res.status(200).json({ message: "Berhasil mengupdate inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteInventarisController = async (req, res) => {
  try {
    await deleteInventaris(req.params.id);
    return res.status(200).json({ message: "Berhasil menghapus inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getInventarisByIdController = async (req, res) => {
  try {
    const inventaris = await getInventarisById(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan inventaris", data: inventaris });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllInventarisController = async (req, res) => {
  try {
    const result = await getAllInventaris({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama,
      ruang: req.query.ruang,
      waktuPengadaan: req.query.waktuPengadaan,
      hargaBeli: req.query.hargaBeli,
    });
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan inventaris", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createJenisInventarisController = async (req, res) => {
  try {
    await createJenisInventaris(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat jenis inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateJenisInventarisController = async (req, res) => {
  try {
    await updateJenisInventaris(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate jenis inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteJenisInventarisController = async (req, res) => {
  try {
    await deleteJenisInventaris(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus jenis inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getJenisInventarisByIdController = async (req, res) => {
  try {
    const jenisInventaris = await getJenisInventarisById(req.params.id);
    return res.status(200).json({
      message: "Berhasil mendapatkan jenis inventaris",
      data: jenisInventaris,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllJenisInventarisController = async (req, res) => {
  try {
    const jenisInventaris = await getAllJenisInventaris({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama,
    });
    return res.status(200).json({
      message: "Berhasil mendapatkan semua jenis inventaris",
      data: jenisInventaris,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllJenisInventarisController2 = async (req, res) => {
  try {
    const result = await getAllInventaris2();
    return res.status(200).json({
      message: "Berhasil mendapatkan semua inventaris",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createPemeliharaanInventarisController = async (req, res) => {
  try {
    await createPemeliharaanInventaris(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat pemeliharaan inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPemeliharaanInventarisByIdController = async (req, res) => {
  try {
    const pemeliharaanInventaris = await getPemeliharaanInventarisById(
      req.params.id
    );
    return res.status(200).json({
      message: "Berhasil mendapatkan pemeliharaan inventaris",
      data: pemeliharaanInventaris,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updatePemeliharaanInventarisController = async (req, res) => {
  try {
    await updatePemeliharaanInventaris(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate pemeliharaan inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePemeliharaanInventarisController = async (req, res) => {
  try {
    await deletePemeliharaanInventaris(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus pemeliharaan inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllPemeliharaanInventarisController = async (req, res) => {
  try {
    const pemeliharaanInventaris = await getAllPemeliharaanInventaris({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama,
      status: req.query.status,
      ruang: req.query.ruang,
      tanggal: req.query.tanggal,
    });
    return res.status(200).json({
      message: "Berhasil mendapatkan semua pemeliharaan inventaris",
      data: pemeliharaanInventaris,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateStatusPemeliharaanController = async (req, res) => {
  try {
    await updateStatusPemeliharaan(req.params.id, req.body.status);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate status pemeliharaan" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
