import {
  addSiswatoKelasKelasMapel,
  createKelasMapel,
  deleteKelasMapel,
  removeSiswaFromKelasMapel,
  updateKelasMapel,
} from "../services/kelasMapelService.js";

export const createKelasMapelController = async (req, res, next) => {
  try {
    const data = {
      nip: req.user.nip,
      namaMapel: req.body.namaMapel,
      ruangKelas: req.body.ruangKelas,
    };
    await createKelasMapel(data);
    return res
      .status(201)
      .json({ message: "Berhasil membuat kelas-mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateKelasMapelController = async (req, res, next) => {
  try {
    await updateKelasMapel(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate kelas-mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteKelasMapelController = async (req, res, next) => {
  try {
    await deleteKelasMapel(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus kelas-mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addSiswatoKelasKelasMapelController = async (req, res, next) => {
  try {
    await addSiswatoKelasKelasMapel(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil menambah siswa ke kelas-mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeSiswaFromKelasMapelController = async (req, res, next) => {
  try {
    await removeSiswaFromKelasMapel(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus siswa dari kelas-mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
