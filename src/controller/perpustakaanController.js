import {
  createBuku,
  getAllBuku,
  deleteBuku,
  pinjamBuku,
  kembalikanBuku,
  deletePeminjamanDanPengembalian,
} from "../services/perpustakaanService.js";

// === BUAT BUKU ===
export const createBukuController = async (req, res) => {
  try {
    const result = await createBuku(req.body, req.file);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === GET ALL BUKU (dengan filter nama) ===
export const getAllBukuController = async (req, res) => {
  try {
    const result = await getAllBuku(req.query);
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
