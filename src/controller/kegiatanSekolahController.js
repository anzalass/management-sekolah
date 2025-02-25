import {
  createKegiatanSekolah,
  deleteKegiatanSekolah,
  getAllKegiatanSekolah,
  getKegiatanSekolahById,
  updateKegiatanSekolah,
} from "../services/kegiatanSekolahService.js";

export const createKegiatanSekolahController = async (req, res, next) => {
  try {
    await createKegiatanSekolah(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat kegiatan sekolah" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateKegiatanSekolahController = async (req, res, next) => {
  try {
    await updateKegiatanSekolah(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate kegiatan sekolah" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteKegiatanSekolahController = async (req, res, next) => {
  try {
    await deleteKegiatanSekolah(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus kegiatan sekolah" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getKegiatanSekolahByIdController = async (req, res, next) => {
  try {
    const kegiatanSekolah = await getKegiatanSekolahById(req.params.id);
    return res.status(200).json({
      message: "Berhasil mendapatkan kegiatan sekolah",
      data: kegiatanSekolah,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllKegiatanSekolahController = async (req, res) => {
  try {
    const { page, nama, pageSize, ta } = req.query;
    const result = await getAllKegiatanSekolah({
      nama,
      ta,
      pageSize,
      page,
    });
    return res.status(200).json({
      message: "Berhasil mendapatkan semua kegiatan sekolah",
      result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
