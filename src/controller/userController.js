import {
  createGuru,
  updateGuru,
  deleteGuru,
  getGuruByNip,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getSiswaByNis,
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

export const updateGuruController = async (req, res, next) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const result = await updateGuru(req.params.nip, req.body, req.file);
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
