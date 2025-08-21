import {
  createTestimoni,
  getAllTestimoni,
  getTestimoniById,
  updateTestimoni,
  deleteTestimoni,
} from "../services/testimoniService.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import localUpload from "../utils/localupload.js";
import memoryUpload from "../utils/multer.js";

export const createTestimoniController = async (req, res) => {
  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { description, parentName } = req.body;
      const { guruId } = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const newTestimoni = await createTestimoni({
        image: req.file,
        description,
        guruId: guruId,
        parentName,
      });

      return res
        .status(201)
        .json({ message: "Testimoni berhasil dibuat", data: newTestimoni });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const getAllTestimoniController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const testimonis = await getAllTestimoni(page, pageSize, search);
    return res.status(200).json({
      data: testimonis.data,
      total: testimonis.total,
      page: testimonis.page,
      pageSize: testimonis.pageSize,
      totalPages: testimonis.totalPages,
    });
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTestimoniByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const testimoni = await getTestimoniById(id);

    if (!testimoni) {
      return res.status(404).json({ message: "Testimoni tidak ditemukan" });
    }

    return res.status(200).json({ data: testimoni });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTestimoniController = async (req, res) => {
  const { id } = req.params;

  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const testimoni = await getTestimoniById(id);

      if (!testimoni) {
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });
      }

      const { description, parentName } = req.body;

      const updatedTestimoni = await updateTestimoni(id, {
        description,
        parentName,
        image: req.file,
      });

      return res.status(200).json({
        message: "Testimoni berhasil diperbarui",
        data: updatedTestimoni,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deleteTestimoniController = async (req, res) => {
  const { id } = req.params;

  try {
    const testimoni = await getTestimoniById(id);

    if (!testimoni) {
      return res.status(404).json({ message: "Testimoni tidak ditemukan" });
    }

    await deleteTestimoni(id);
    return res.status(200).json({
      message: "Testimoni berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
