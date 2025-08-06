import {
  createArsip,
  deleteArsip,
  getAllArsip,
} from "../services/arsipService.js";
import fileUpload from "../utils/pdfUpload.js";

// POST /api/arsip
export const createArsipController = async (req, res) => {
  fileUpload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const data = req.body;
      const file = req.file; // asumsi dari multer
      console.log("filee ctrl", file);

      await createArsip(data, file);

      res.status(201).json({
        success: true,
        message: "Arsip berhasil dibuat",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Terjadi kesalahan saat membuat arsip",
      });
    }
  });
};

// DELETE /api/arsip/:id
export const deleteArsipController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteArsip(Number(id));

    res.status(200).json({
      success: true,
      message: "Arsip berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Gagal menghapus arsip",
    });
  }
};

// GET /api/arsip
export const getAllArsipController = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      namaBerkas = "",
      keterangan = "",
      tanggal = "",
    } = req.query;

    const result = await getAllArsip({
      page: Number(page),
      pageSize: Number(pageSize),
      namaBerkas,
      keterangan,
      tanggal,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil data arsip",
    });
  }
};
