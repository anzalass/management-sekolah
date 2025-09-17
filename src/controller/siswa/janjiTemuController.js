// controllers/janjiTemuController.ts
import * as janjiTemuService from "../../services/siswa/janjiTemuService.js";

// CREATE
export const createJanjiTemuController = async (req, res) => {
  try {
    const data = req.body;
    const idSiswa = req.user.idGuru;
    const result = await janjiTemuService.createJanjiTemu(data, idSiswa);
    return res.status(201).json({
      success: true,
      message: "Janji temu berhasil dibuat",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - get all
export const getAllJanjiTemuController = async (req, res) => {
  try {
    const result = await janjiTemuService.getAllJanjiTemu();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - get by ID
export const getJanjiTemuByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await janjiTemuService.getJanjiTemuById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Janji temu tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - get by idSiswa
export const getJanjiTemuByIdSiswaController = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const result = await janjiTemuService.getJanjiTemuByIdSiswa(idGuru);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - get by idGuru
export const getJanjiTemuByIdGuruController = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const result = await janjiTemuService.getJanjiTemuByIdGuru(idGuru);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateJanjiTemuController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await janjiTemuService.updateJanjiTemu(id, data);

    return res.json({
      success: true,
      message: "Janji temu berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteJanjiTemuController = async (req, res) => {
  try {
    const { id } = req.params;
    await janjiTemuService.deleteJanjiTemu(id);

    return res.json({
      success: true,
      message: "Janji temu berhasil dihapus",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStatusJanjiTemuController = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;
    const result = await janjiTemuService.updateStatusJanjiTemu(id, status);

    return res.json({
      success: true,
      message: "Janji temu berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
