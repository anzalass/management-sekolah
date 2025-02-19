import {
  createGuru,
  updateGuru,
  deleteGuru,
  getGuruByNip,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getSiswaByNis,
  getAllGuru,
  getAllSiswa,
  createRiwayatPendidikan,
  deleteRiwayatPendidikan,
} from "../services/userService.js";
import upload from "../utils/multer.js";

export const createGuruController = async (req, res) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const result = await createGuru(req.body, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const createRiwayatPendidikanController = async (req, res, next) => {
  try {
    await createRiwayatPendidikan(req.params.nip, req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat riwayat pendidikan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRiwayatPendidikanController = async (req, res, next) => {
  try {
    await deleteRiwayatPendidikan(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus riwayat pendidikan" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateGuruController = async (req, res, next) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const result = await updateGuru(req.params.nip, req.body, req.file);
      console.log("awikwok", req.file);

      return res
        .status(201)
        .json({ message: "Berhasil mengupdate guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deleteGuruController = async (req, res, next) => {
  try {
    await deleteGuru(req.params.nip);
    return res.status(200).json({ message: "Berhasil menghapus guru" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getGuruByNipController = async (req, res, next) => {
  try {
    const result = await getGuruByNip(req.params.nip);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan guru", data: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createSiswaController = async (req, res, next) => {
  try {
    const result = await createSiswa(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat siswa", data: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
export const updateSiswaController = async (req, res, next) => {
  try {
    const result = await updateSiswa(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil mengupdate siswa", data: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const deleteSiswaController = async (req, res, next) => {
  try {
    await deleteSiswa(req.params.nis);
    return res.status(200).json({ message: "Berhasil menghapus siswa" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getSiswaByNisController = async (req, res, next) => {
  try {
    const result = await getSiswaByNis(req.params.nis);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan siswa", data: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAllGuruController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await getAllGuru({
      page,
      pageSize,
      nama: req.query.nama || "",
      nip: req.query.nip || "",
    });

    return res.status(200).json({
      message: "Berhasil mendapatkan semua guru",
      result,
    });
  } catch (error) {
    console.error("Error di getAllGuruController:", error); // Log error di backend
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export const getAllSiswaController = async (req, res, next) => {
  try {
    const result = await getAllSiswa(
      req.query.page,
      req.query.nama,
      req.query.nis,
      req.query.kelas
    );
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan semua siswa", data: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
