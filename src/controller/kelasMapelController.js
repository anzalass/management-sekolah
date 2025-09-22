import {
  addSiswatoKelasKelasMapel,
  createKelasMapel,
  deleteKelasMapel,
  getDetailKelasMapel,
  removeSiswaFromKelasMapel,
  updateKelasMapel,
} from "../services/kelasMapelService.js";
import memoryUpload from "../utils/multer.js";

export const createKelasMapelController = async (req, res, next) => {
  memoryUpload.single("banner")(req, res, async (err) => {
    try {
      const data = {
        namaGuru: req.user.nama,
        nipGuru: req.user.nip,
        idGuru: req.user.idGuru,
        namaMapel: req.body.namaMapel,
        ruangKelas: req.body.ruangKelas,
        kelas: req.body.kelas,
      };
      await createKelasMapel(data, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat kelas-mata pelajaran" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const updateKelasMapelController = async (req, res, next) => {
  memoryUpload.single("banner")(req, res, async (err) => {
    try {
      await updateKelasMapel(req.params.id, req.body, req.file);
      return res
        .status(200)
        .json({ message: "Berhasil mengupdate kelas-mata pelajaran" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
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

export const getDetailKelasMapelController = async (req, res, next) => {
  try {
    const data = await getDetailKelasMapel(req.params.id, req.user.idGuru);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan detail mata pelajaran", data });
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
