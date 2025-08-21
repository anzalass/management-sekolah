import {
  absenMasukGuru,
  absenPulangGuru,
  getAllKehadiranGuru,
} from "../services/KehadiranGurudanStaff.js";
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
      console.error("Absen Masuk Error:", error);
      return res.status(400).json({ message: error.message });
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
    console.error("Absen Pulang Error:", error);
    return res.status(400).json({ message: error.message });
  }
};
export const getKehadiranGuruController = async (req, res) => {
  try {
    const { tanggal, nama, nip, pageSize, page } = req.query;

    const kehadiran = await getAllKehadiranGuru({
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 10,
      tanggal,
      nama,
      nip,
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data kehadiran guru",
      data: kehadiran,
    });
  } catch (error) {
    console.error("Gagal mengambil kehadiran guru:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data kehadiran guru",
    });
  }
};
