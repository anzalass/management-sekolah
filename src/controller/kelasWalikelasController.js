import {
  addSiswatoKelasWaliKelas,
  createKelasWaliKelas,
  deleteKelasWaliKelas,
  deleteSiswatoKelasWaliKelas,
  getKelasWaliKelasById,
  getSiswaByIdKelas,
  terbitkanRapot,
  updateKelasWaliKelas,
} from "../services/kelasWalikelasService.js";
import memoryUpload from "../utils/multer.js";

export const createKelasWaliKelasController = async (req, res, next) => {
  memoryUpload.single("banner")(req, res, async (err) => {
    try {
      const data = {
        namaGuru: req.user.nama,
        nipGuru: req.user.nip,
        idGuru: req.user.idGuru,
        nama: req.body.nama,
        ruangKelas: req.body.ruangKelas,
      };
      await createKelasWaliKelas(data, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat kelas wali kelas", success: true });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};

export const updateKelasWaliKelasController = async (req, res, next) => {
  memoryUpload.single("banner")(req, res, async (err) => {
    try {
      await updateKelasWaliKelas(req.params.id, req.body, req.file);
      return res.status(200).json({
        message: "Berhasil mengupdate kelas wali kelas",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};

export const deleteKelasWaliKelasController = async (req, res, next) => {
  try {
    await deleteKelasWaliKelas(req.params.id);
    return res
      .status(204)
      .json({ message: "Berhasil menghapus kelas wali kelas", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getKelasWaliKelasByIdController = async (req, res, next) => {
  try {
    const kelas = await getKelasWaliKelasById(req.params.id);
    return res.status(200).json(kelas);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const addSiswatoKelasWaliKelasController = async (req, res, next) => {
  try {
    await addSiswatoKelasWaliKelas(req.body);
    return res.status(201).json({
      message: "Berhasil menambah siswa ke kelas wali kelas",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteSiswatoKelasWaliKelasController = async (req, res, next) => {
  try {
    await deleteSiswatoKelasWaliKelas(req.params.id);
    return res.status(204).json({
      message: "Berhasil menghapus siswa dari kelas wali kelas",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getSiswaByIdKelasHandler = async (req, res) => {
  try {
    const siswaList = await getSiswaByIdKelas(req.params.idKelas);
    res.status(200).json(siswaList);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const terbitkanRapotController = async (req, res) => {
  try {
    await terbitkanRapot(req.params.id, req.body.value);
    return res.status(200).json({
      message: "Berhasil Menerbitkan Rapot",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
