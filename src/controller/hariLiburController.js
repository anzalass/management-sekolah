import * as hariLiburService from "../services/hariLiburService.js";

/**
 * CREATE
 * POST /hari-libur
 */
export const createHariLiburController = async (req, res) => {
  try {
    const result = await hariLiburService.createHariLibur(req.body);

    return res.status(201).json({
      message: "Hari libur berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * UPDATE
 * PUT /hari-libur/:id
 */
export const updateHariLiburController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await hariLiburService.updateHariLibur(id, req.body);

    return res.json({
      message: "Hari libur berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE
 * DELETE /hari-libur/:id
 */
export const deleteHariLiburController = async (req, res) => {
  try {
    const { id } = req.params;

    await hariLiburService.deleteHariLibur(id);

    return res.json({
      message: "Hari libur berhasil dihapus",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * GET BY ID
 * GET /hari-libur/:id
 */
export const getHariLiburByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await hariLiburService.getHariLiburById(id);

    if (!data) {
      return res.status(404).json({
        message: "Hari libur tidak ditemukan",
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * GET ALL + PAGINATION + FILTER
 * GET /hari-libur
 */
export const getHariLiburPaginatedController = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, namaHari, tanggal } = req.query;

    const result = await hariLiburService.getHariLiburPaginated({
      page: Number(page),
      size: Number(pageSize),
      namaHari,
      tanggal,
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
