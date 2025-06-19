import fs from "fs";
import upload from "../utils/multer.js";
import { fileURLToPath } from "url";
import path from "path";
import { createGuruTemplate,deletedGuruTemplate,getGuruTemplate,getGuruTemplateByid, updateGuruTemplate } from "../services/GuruTemplateService.js";
import localUpload from "../utils/localupload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createGuruTemplateController = async (req, res) => {
  localUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name } = req.body;
       const { guruId } = req.user;

      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib diunggah" });
      }

      const imagePath = req.file.path.replace(/\\/g, "/");

      const Guru = await createGuruTemplate({ image: imagePath, name, guruId: guruId });

      return res.status(201).json({ message: "Template berhasil dibuat", data: Guru });
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

  localUpload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const guru = await getGuruTemplateByid(id);

      if (!guru) {
        return res.status(404).json({ message: "Template tidak ditemukan" });
      }

     const { name } = req.body;
      let imagePath = guru.image;
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

      const result = await updateGuruTemplate(id, {name ,image: imagePath });

      return res.status(200).json({ message: "Template berhasil diperbarui", data: result });
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

        deletedGuruTemplate(id)
          .then(() => {
            return res.status(200).json({ message: "Template dan gambar berhasil dihapus" });
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
