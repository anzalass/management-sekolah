import {
  addSiswatoKelasWaliKelas,
  createKelasWaliKelas,
  deleteKelasWaliKelas,
  deleteSiswatoKelasWaliKelas,
  getKelasWaliKelasById,
  updateKelasWaliKelas,
} from "../services/kelasWalikelasService.js";

export const createKelasWaliKelasController = async (req, res, next) => {
  try {
    const data = {
      nip: req.user.nip,
      nama: req.body.nama,
      ruangKelas: req.body.ruangKelas,
      periode: req.body.periode,
      guru: req.body.guru,
    };
    await createKelasWaliKelas(data);
    return res
      .status(201)
      .json({ message: "Berhasil membuat kelas wali kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateKelasWaliKelasController = async (req, res, next) => {
  try {
    await updateKelasWaliKelas(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate kelas wali kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteKelasWaliKelasController = async (req, res, next) => {
  try {
    await deleteKelasWaliKelas(req.params.id);
    return res
      .status(204)
      .json({ message: "Berhasil menghapus kelas wali kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getKelasWaliKelasByIdController = async (req, res, next) => {
  try {
    const kelas = await getKelasWaliKelasById(req.params.id);
    return res.status(200).json(kelas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addSiswatoKelasWaliKelasController = async (req, res, next) => {
  try {
    await addSiswatoKelasWaliKelas(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil menambah siswa ke kelas wali kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSiswatoKelasWaliKelasController = async (req, res, next) => {
  try {
    await deleteSiswatoKelasWaliKelas(req.params.id);
    return res
      .status(204)
      .json({ message: "Berhasil menghapus siswa dari kelas wali kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
