import {
  createAnggaran,
  deleteAnggaran,
  getAnggaranById,
  updateAnggaran,
} from "../services/anggaranService.js";

export const createAnggaranController = async (req, res, next) => {
  try {
    await createAnggaran(req.body);
    return res.status(201).json({ message: "Berhasil membuat anggaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAnggaranController = async (req, res, next) => {
  try {
    await updateAnggaran(req.params.idAnggaran, req.body);
    return res.status(200).json({ message: "Berhasil mengupdate anggaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAnggaranController = async (req, res, next) => {
  try {
    await deleteAnggaran(req.params.idAnggaran);
    return res.status(200).json({ message: "Berhasil menghapus anggaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAnggaranByIdController = async (req, res, next) => {
  try {
    const anggaran = await getAnggaranById(req.params.idAnggaran);
    return res.status(200).json(anggaran);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
