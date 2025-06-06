
import { createNews, deleteNews, getAllNews, getNewsById, updateNews } from "../services/newsService.js";
import fs from "fs";
import upload from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createNewsController = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title,content } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const imagePath = req.file.path.replace(/\\/g, "/");

      const newNews = await createNews({ image: imagePath, title,content, userId: req.user.userId, });

      return res.status(201).json({ message: "News berhasil dibuat", data: newNews });
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
    console.error('Error fetching news:', error);
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

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const news = await getNewsById(id);

      if (!news) {
        return res.status(404).json({ message: "News tidak ditemukan" });
      }

     const { title,content } = req.body;
      let imagePath = news.image;
      if (req.file) {
        const oldImagePath = path.join(__dirname, "../../uploads", path.basename(imagePath));
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error("Failed to delete old image:", err);
              } else {
                console.log("Old image deleted successfully.");
              }
            });
          }
        });

        imagePath = req.file.path.replace(/\\/g, "/");
      }

      const updatedNews = await updateNews(id, { title, content ,image: imagePath });

      return res.status(200).json({ message: "News berhasil diperbarui", data: updatedNews });
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

    const imagePath = news.image;
    const filePath = path.join(__dirname, "../../uploads", path.basename(imagePath));
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File does not exist:", err);
        return res.status(404).json({ message: "File tidak ditemukan" });
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Gagal menghapus file" });
        }

        deleteNews(id)
          .then(() => {
            return res.status(200).json({ message: "News dan gambar berhasil dihapus" });
          })
          .catch((dbError) => {
            return res.status(500).json({ message: dbError.message });
          });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
