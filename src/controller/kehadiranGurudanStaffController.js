import {
  absenMasukGuru,
  absenPulangGuru,
} from "../services/KehadiranGurudanStaff.js";
import memoryUpload from "../utils/multer.js";

export const absenMasukGuruController = (req, res) => {
  memoryUpload.single("fotoMasuk")(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: "Gagal upload foto masuk" });

    try {
      const nipGuru = req.user?.nip;
      const { lat, long } = req.body;

      console.log("fotooo", req.file);

      if (!lat || !long)
        return res.status(400).json({ message: "Koordinat wajib diisi" });
      if (!nipGuru)
        return res.status(401).json({ message: "NIP tidak ditemukan" });

      const result = await absenMasukGuru({
        nipGuru,
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
    const nipGuru = req.user?.nip;
    const { lat, long } = req.body;

    if (!lat || !long)
      return res.status(400).json({ message: "Koordinat wajib diisi" });
    if (!nipGuru)
      return res.status(401).json({ message: "NIP tidak ditemukan" });

    const result = await absenPulangGuru({
      nipGuru,
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
