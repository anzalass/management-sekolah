import {
  createArsip,
  deleteArsip,
  getAllArsip,
} from "../services/arsipService.js";
import fileUpload from "../utils/pdfUpload.js";

const tipeController = "arsip";

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

      return res
        .status(201)
        .json({ message: `Berhasil membuat ${tipeController}`, success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};

// DELETE /api/arsip/:id
export const deleteArsipController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteArsip(id);

    return res
      .status(201)
      .json({ message: `Berhasil menghapus ${tipeController}`, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
  }
};
