import {
  createBukuPerpustakaan,
  createPeminjaman,
  deleteBukuPerpustakaan,
  deletePeminjaman,
  getBukuPerpustakaanById,
  getPeminjamanByNis,
  updateBukuPerpustakaan,
  updatePeminjaman,
  updateStatusPeminjaman,
} from "../services/perpustakaanService.js";

export const createBukuPerpustakaanController = async (req, res, next) => {
  try {
    await createBukuPerpustakaan(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat buku perpustakaan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBukuPerpustakaanController = async (req, res, next) => {
  try {
    await updateBukuPerpustakaan(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate buku perpustakaan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBukuPerpustakaanController = async (req, res, next) => {
  try {
    await deleteBukuPerpustakaan(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus buku perpustakaan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBukuPerpustakaanByIdController = async (req, res, next) => {
  try {
    const buku = await getBukuPerpustakaanById(req.params.id);
    return res.status(200).json(buku);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPeminjamanController = async (req, res, next) => {
  try {
    const data = {
      idBbuku: req.body.idBbuku,
      nis: req.body.nis,
      waktuPinjam: new Date(),
      waktuKembali: req.body.waktuKembali,
      status: "Pinjam",
      keterangan: req.body.keterangan,
    };
    await createPeminjaman(data);
    return res.status(200).json({ data: req.user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPeminjamanByNisController = async (req, res, next) => {
  try {
    const peminjaman = await getPeminjamanByNis(req.params.nis);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan pinjaman by NIS" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStatusPeminjamanController = async (req, res) => {
  try {
    await updateStatusPeminjaman(req.params.id, req.body.status);
    return res
      .status(200)
      .json({ message: "Berhasil mengubah status peminjaman" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePeminjamanController = async (req, res) => {
  try {
    await updatePeminjaman(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate data peminjaman" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePeminjamanController = async (req, res) => {
  try {
    await deletePeminjaman(req.params.id);
    return res.status(200).json({ message: "Berhasil menghapus peminjaman" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
