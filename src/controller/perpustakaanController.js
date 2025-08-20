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
import memoryUpload from "../utils/multer.js";
import fileUpload from "../utils/pdfUpload.js";

// === BUAT BUKU ===
export const createBukuController = async (req, res) => {
  fileUpload.single("filepdf")(req, res, async (err) => {
    try {
      console.log("file", req.file);

      const result = await createBuku(req.body, req.file);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};

// === UPDATE BUKU ===
export const updateBukuController = async (req, res) => {
  fileUpload.single("filepdf")(req, res, async (err) => {
    try {
      const result = await updateBuku(req.params.id, req.body, req.file);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};

// === GET ALL BUKU (dengan filter nama) ===
export const getAllBukuController = async (req, res) => {
  try {
    const result = await getAllBuku({
      nama: req.query.nama,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};

// === HAPUS BUKU ===
export const deleteBukuController = async (req, res) => {
  try {
    const result = await deleteBuku(req.params.id);
    res.status(200).json({ message: "Buku berhasil dihapus", data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getBukuByIdController = async (req, res) => {
  try {
    const result = await getBukuById(req.params.id);
    res.status(200).json({ message: "Buku berhasil dihapus", data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// === PINJAM BUKU ===
export const pinjamBukuController = async (req, res) => {
  try {
    const result = await pinjamBuku(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === KEMBALIKAN BUKU ===
export const kembalikanBukuController = async (req, res) => {
  try {
    const result = await kembalikanBuku(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === HAPUS DATA PEMINJAMAN ===
export const deletePeminjamanController = async (req, res) => {
  try {
    const result = await deletePeminjamanDanPengembalian(req.params.id);
    res
      .status(200)
      .json({ message: "Peminjaman berhasil dihapus", data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
