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
    const result = await getAllKonseling(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

export const getAllPelanggaranPrestasiController = async (req, res) => {
  try {
    const result = await getPelanggaranPrestasiList(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
