import fs from "fs";
import upload, { memoryUpload } from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";
import {
  createGuruTemplate,
  deletedGuruTemplate,
  getGuruTemplate,
  getGuruTemplateByid,
  updateGuruTemplate,
} from "../services/GuruTemplateService.js";

export const createGuruTemplateController = async (req, res) => {
  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name } = req.body;
      const { guruId } = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const Guru = await createGuruTemplate({
        image: req.file,
        name,
        guruId: guruId,
      });

      return res
        .status(201)
        .json({ message: "Template berhasil dibuat", data: Guru });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const getAllGuruTemplateController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const guruTemplates = await getGuruTemplate(page, pageSize, search);
    return res.status(200).json({
      data: guruTemplates.data,
      total: guruTemplates.total,
      page: guruTemplates.page,
      pageSize: guruTemplates.pageSize,
      totalPages: guruTemplates.totalPages,
    });
  } catch (error) {
    console.error("Error fetching guru templates:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getGuruTemplateByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await getGuruTemplateByid(id);

    if (!news) {
      return res.status(404).json({ message: "News tidak ditemukan" });
    }

    return res.status(200).json({ data: news });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateGuruTemplateController = async (req, res) => {
  const { id } = req.params;

  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const guru = await getGuruTemplateByid(id);

      if (!guru) {
        return res.status(404).json({ message: "Template tidak ditemukan" });
      }

      const { name } = req.body;

      const result = await updateGuruTemplate(id, { name, image: req.file });

      return res
        .status(200)
        .json({ message: "Template berhasil diperbarui", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deletedGuruTemplateController = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await getGuruTemplateByid(id);

    if (!news) {
      return res.status(404).json({ message: "Template tidak ditemukan" });
    }
    await deletedGuruTemplate(id);

    return res.status(200).json({ message: "Template berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
