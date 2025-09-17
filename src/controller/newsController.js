import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from "../services/newsService.js";
import fs from "fs";
import upload, { memoryUpload } from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";
import localUpload from "../utils/localupload.js";

export const createNewsController = async (req, res) => {
  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, content } = req.body;
      const guruId = req.user.idGuru; // <-- ambil dari token

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      if (!guruId) {
        return res
          .status(403)
          .json({ message: "Akses ditolak, guruId tidak ditemukan di token" });
      }

      const newNews = await createNews({
        image: req.file,
        title,
        content,
        guruId,
      });

      return res
        .status(201)
        .json({ message: "News berhasil dibuat", data: newNews });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const getAllNewsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const news = await getAllNews(page, pageSize, search);
    return res.status(200).json({
      data: news.data,
      total: news.total,
      page: news.page,
      pageSize: news.pageSize,
      totalPages: news.totalPages,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getNewsByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await getNewsById(id);

    if (!news) {
      return res.status(404).json({ message: "News tidak ditemukan" });
    }

    return res.status(200).json({ data: news });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateNewsController = async (req, res) => {
  const { id } = req.params;

  memoryUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const news = await getNewsById(id);

      if (!news) {
        return res.status(404).json({ message: "News tidak ditemukan" });
      }

      const { title, content } = req.body;
      console.log("img ctrle", req.file);

      const updatedNews = await updateNews(id, {
        title,
        content,
        image: req.file,
      });

      return res
        .status(200)
        .json({ message: "News berhasil diperbarui", data: updatedNews });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deleteNewsController = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await getNewsById(id);

    if (!news) {
      return res.status(404).json({ message: "News tidak ditemukan" });
    }
    await deleteNews(id);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
