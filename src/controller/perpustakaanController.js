import {
  createBuku,
  getAllBuku,
  deleteBuku,
  pinjamBuku,
  kembalikanBuku,
  deletePeminjamanDanPengembalian,
  getBukuById,
  updateBuku,
  getAllPeminjamanPengembalian,
} from "../services/perpustakaanService.js";
import uploadPdfImage from "../utils/pdfAndImage.js";
import fileUpload from "../utils/pdfUpload.js";

export const createBukuController = async (req, res) => {
  uploadPdfImage.fields([
    { name: "image", maxCount: 1 },
    { name: "filepdf", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const imageFile = req.files?.image?.[0] || null;
      const pdfFile = req.files?.filepdf?.[0] || null;

      await createBuku(req.body, pdfFile, imageFile);

      return res
        .status(201)
        .json({ message: "Berhasil membuat buku", success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message, success: false });
    }
  });
};
export const updateBukuController = async (req, res) => {
  fileUpload.single("filepdf")(req, res, async (err) => {
    try {
      await updateBuku(req.params.id, req.body, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil mengubah buku", success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message, success: false });
    }
  });
};

export const getAllBukuController = async (req, res) => {
  try {
    const result = await getAllBuku({
      nama: req.query.nama,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
};

export const getAllPeminjamanPengembalianController = async (req, res) => {
  try {
    const result = await getAllPeminjamanPengembalian({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      namaBuku: req.query.nama,
      nis: req.query.nis,
      status: req.query.status,
    });
    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
};

export const deleteBukuController = async (req, res) => {
  try {
    await deleteBuku(req.params.id);
    return res
      .status(200)
      .json({ message: "Buku berhasil dihapus", success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
};

export const getBukuByIdController = async (req, res) => {
  try {
    const result = await getBukuById(req.params.id);
    res.status(200).json({ message: "Buku berhasil dihapus", data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
};

export const pinjamBukuController = async (req, res) => {
  try {
    await pinjamBuku(req.body);
    return res
      .status(200)
      .json({ message: "Buku berhasil dipinjam", success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message, success: false });
  }
};

export const kembalikanBukuController = async (req, res) => {
  try {
    await kembalikanBuku(req.params.id);
    return res
      .status(200)
      .json({ message: "Buku berhasil dikembalikan", success: true });
  } catch (err) {
    res.status(400).json({ error: err.message, success: false });
  }
};

export const deletePeminjamanController = async (req, res) => {
  try {
    await deletePeminjamanDanPengembalian(req.params.id);
    res
      .status(200)
      .json({ message: "Peminjaman berhasil dihapus", success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
};
