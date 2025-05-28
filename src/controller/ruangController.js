import {
  updateRuang,
  getRuangById,
  deleteRuang,
  createRuang,
  getAllRuang,
  getAllRuang2,
} from "../services/ruangService.js";

export const createRuangController = async (req, res, next) => {
  try {
    await createRuang(req.body);
    return res.status(201).json({ message: "Berhasil membuat ruang " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRuangController = async (req, res, next) => {
  try {
    console.log("body", req.body);
    await updateRuang(req.params.id, req.body);
    return res.status(200).json({ message: "Berhasil mengubah ruang " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRuangController = async (req, res, next) => {
  try {
    await deleteRuang(req.params.id);
    return res.status(200).json({ message: "Berhasil menghapus ruang " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRuangByIdController = async (req, res, next) => {
  try {
    const ruang = await getRuangById(req.params.id);
    return res.status(200).json(ruang);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllRuangController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { nama } = req.query;
    const result = await getAllRuang({ page, pageSize, nama });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllRuangController2 = async (req, res, next) => {
  try {
    const ruang = await getAllRuang2();
    return res.status(200).json({ data: ruang });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
