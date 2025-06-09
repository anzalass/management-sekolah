import { createGallery,deletedGallery,getAllGallery,getGalleryByid, updateGallery} from "../services/galeryService.js";
import fs from "fs";
import upload from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createGalleryController = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
     
      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const imagePath = req.file.path.replace(/\\/g, "/");

      const newNews = await createGallery({ image: imagePath,userId: req.user.userId });

      return res.status(201).json({ message: "Gallery berhasil dibuat", data: newNews });
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

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const news = await getGalleryByid(id);

      if (!news) {
        return res.status(404).json({ message: "gallery tidak ditemukan" });
      }

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

      const updatedNews = await updateGallery(id, { image: imagePath });

      return res.status(200).json({ message: "Gallery berhasil diperbarui", data: updatedNews });
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

    const imagePath = gallery.image;
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

        deletedGallery(id)
          .then(() => {
            return res.status(200).json({ message: "Gallery dan gambar berhasil dihapus" });
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
