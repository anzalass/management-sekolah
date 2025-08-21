import {
  createGallery,
  deletedGallery,
  getAllGallery,
  getGalleryByid,
  updateGallery,
} from "../services/galeryService.js";
import fs from "fs";
import upload, { memoryUpload } from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createGalleryController = async (req, res) => {
  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const guruId = req.user.idGuru;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const newNews = await createGallery({
        guruId: guruId,
        image: req.file,
      });

      return res
        .status(201)
        .json({ message: "Gallery berhasil dibuat", data: newNews });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const getAllGalleryController = async (req, res) => {
  try {
    const news = await getAllGallery();
    return res.status(200).json({ data: news });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGalleryByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await getGalleryByid(id);

    if (!news) {
      return res.status(404).json({ message: "News tidak ditemukan" });
    }

    return res.status(200).json({ data: news });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateGalleryController = async (req, res) => {
  const { id } = req.params;

  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const news = await getGalleryByid(id);

      if (!news) {
        return res.status(404).json({ message: "gallery tidak ditemukan" });
      }

      const updatedNews = await updateGallery(id, { image: req.file });

      return res
        .status(200)
        .json({ message: "Gallery berhasil diperbarui", data: updatedNews });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deletedGalleryController = async (req, res) => {
  const { id } = req.params;

  try {
    const gallery = await getGalleryByid(id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery tidak ditemukan" });
    }

    await deletedGallery(id);
    return res.status(200).json({ message: "Gallery berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
