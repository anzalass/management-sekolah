import {
  createGallery,
  deletedGallery,
  getAllGallery,
  getGalleryByid,
  updateGallery,
} from "../services/galeryService.js";
import fs from "fs";
import upload, { memoryUpload } from "../utils/multer.js";

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

      await createGallery({
        guruId: guruId,
        image: req.file,
      });

      return res
        .status(201)
        .json({ message: "Gallery berhasil dibuat", success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};

export const getAllGalleryController = async (req, res) => {
  try {
    const gallery = await getAllGallery();
    return res.status(200).json({ data: gallery });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getGalleryByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const Gallery = await getGalleryByid(id);

    if (!Gallery) {
      return res.status(404).json({ message: "Gallery tidak ditemukan" });
    }

    return res.status(200).json({ data: Gallery });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateGalleryController = async (req, res) => {
  const { id } = req.params;

  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const gallery = await getGalleryByid(id);

      if (!gallery) {
        return res.status(404).json({ message: "gallery tidak ditemukan" });
      }

      await updateGallery(id, { image: req.file });
      return res
        .status(200)
        .json({ message: "Gallery berhasil diperbarui", success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
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
    return res
      .status(200)
      .json({ message: "Gallery berhasil dihapus", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
