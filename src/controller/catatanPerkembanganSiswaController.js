import * as catatanService from "../services/catatanPerkembanganSiswaService.js";

const tipeController = "catatan perkembangan siswa";

export const createCatatan = async (req, res, next) => {
  try {
    const data = req.body;
    await catatanService.createCatatan(data);
    return res
      .status(201)
      .json({ message: `Berhasil membuat ${tipeController}`, success: true });
  } catch (error) {
    next(error);
  }
};

export const getAllCatatan = async (req, res, next) => {
  try {
    const result = await catatanService.getAllCatatan();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCatatanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await catatanService.getCatatanById(id);
    if (!result)
      return res.status(404).json({ message: "Catatan tidak ditemukan" });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCatatanByIdKelas = async (req, res, next) => {
  try {
    const { idKelas } = req.params;
    const result = await catatanService.getCatatanByIdKelas(idKelas);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCatatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await catatanService.updateCatatan(id, data);
    return res
      .status(201)
      .json({ message: `Berhasil mengubah ${tipeController}`, success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteCatatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await catatanService.deleteCatatan(id);
    return res
      .status(201)
      .json({ message: `Berhasil menghapus ${tipeController}`, success: true });
  } catch (error) {
    next(error);
  }
};
