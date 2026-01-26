import {
  absenMasukGuru,
  absenPulangGuru,
  getAllKehadiranGuru,
  getKehadiranGuruByIdGuru,
} from "../services/KehadiranGurudanStaff.js";
import { getRekapHadirBulanan } from "../services/perizinanGuruService.js";
import memoryUpload from "../utils/multer.js";

export const absenMasukGuruController = (req, res) => {
  memoryUpload.single("fotoMasuk")(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: "Gagal upload foto masuk" });

    try {
      const idGuru = req.user?.idGuru;
      const { lat, long } = req.body;

      console.log("fotooo", req.file);

      if (!lat || !long)
        return res.status(400).json({ message: "Koordinat wajib diisi" });
      if (!idGuru)
        return res.status(401).json({ message: "idGuru tidak ditemukan" });

      const result = await absenMasukGuru({
        idGuru,
        fotoMasuk: req.file, // file buffer dari multer
        lokasi: {
          lat: parseFloat(lat),
          long: parseFloat(long),
        },
      });

      return res.status(201).json({
        message: "Absen masuk berhasil",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};

export const absenPulangGuruController = async (req, res) => {
  try {
    const idGuru = req.user?.idGuru;
    const { lat, long } = req.body;

    if (!lat || !long)
      return res.status(400).json({ message: "Koordinat wajib diisi" });
    if (!idGuru)
      return res.status(401).json({ message: "NIP tidak ditemukan" });

    const result = await absenPulangGuru({
      idGuru,
      lokasi: {
        lat: parseFloat(lat),
        long: parseFloat(long),
      },
    });

    return res.status(200).json({
      message: "Absen pulang berhasil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const getKehadiranGuruController = async (req, res) => {
  try {
    const { startDate, endDate, nama, nip, pageSize, page } = req.query;

    const kehadiran = await getAllKehadiranGuru({
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 10,
      startDate,
      endDate,
      nama,
      nip,
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data kehadiran guru",
      data: kehadiran,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getKehadiranGuruByIdGuruController = async (req, res) => {
  try {
    const { idGuru, page = 1, pageSize = 10, startDate, endDate } = req.query;

    const result = await getKehadiranGuruByIdGuru({
      idGuru,
      page,
      pageSize,
      startDate,
      endDate,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const rekapHadirBulanan = async (req, res) => {
  try {
    const data = await getRekapHadirBulanan({
      nama: req.query.nama,
      nip: req.query.nip,
    });

    res.json({
      bulan: new Date().toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      }),
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil rekap kehadiran",
    });
  }
};
