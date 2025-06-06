import { createTestimoni, getAllTestimoni, getTestimoniById, updateTestimoni, deleteTestimoni } from "../services/testimoniService.js";
import fs from "fs";
import upload from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createTestimoniController = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { description } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const imagePath = req.file.path.replace(/\\/g, "/");

      const newTestimoni = await createTestimoni({ image: imagePath, description, userId: req.user.userId, });

      return res.status(201).json({ message: "Testimoni berhasil dibuat", data: newTestimoni });
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
    console.error('Error fetching testimonies:', error);
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

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const testimoni = await getTestimoniById(id);

      if (!testimoni) {
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });
      }

      const { description } = req.body;
      let imagePath = testimoni.image;
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

      const updatedTestimoni = await updateTestimoni(id, { description, image: imagePath });

      return res.status(200).json({ message: "Testimoni berhasil diperbarui", data: updatedTestimoni });
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

    const imagePath = testimoni.image;
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

        deleteTestimoni(id)
          .then(() => {
            return res.status(200).json({ message: "Testimoni dan gambar berhasil dihapus" });
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
