import {
  createAnggaran,
  deleteAnggaran,
  getAllAnggaran,
  getAnggaranById,
  updateAnggaran,
} from "../services/anggaranService.js";

const tipeController = "anggaran";

export const createAnggaranController = async (req, res, next) => {
  try {
    await createAnggaran(req.body);
    return res
      .status(201)
      .json({ message: `Berhasil membuat ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateAnggaranController = async (req, res, next) => {
  try {
    await updateAnggaran(req.params.idAnggaran, req.body);
    return res
      .status(200)
      .json({ message: `Berhasil mengupdate ${tipeController}` });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteAnggaranController = async (req, res, next) => {
  try {
    await deleteAnggaran(req.params.idAnggaran);
    return res
      .status(200)
      .json({ message: `Berhasil menghapus  ${tipeController}` });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAnggaranByIdController = async (req, res, next) => {
  try {
    const anggaran = await getAnggaranById(req.params.idAnggaran);
    return res
      .status(200)
      .json({
        message: `Berhasil mendapatkan data ${tipeController}`,
        data: anggaran,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllAnggaranControllers = async (req, res, next) => {
  try {
    const anggaran = await getAllAnggaran({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama,
      jenis: req.query.jenis,
      tanggal: req.query.tanggal,
      jumlah: parseInt(req.query.jumlah),
    });
    return res.status(200).json(anggaran);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
