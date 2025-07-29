import {
  createPerizinanGuru,
  deletePerizinanGuru,
  getPerizinanGuru,
  getPerizinanGuruById,
  updateStatusPerizinanGuru,
} from "../services/perizinanGuruService.js";
import memoryUpload from "../utils/multer.js";

export const createPerizinanGuruController = async (req, res, next) => {
  memoryUpload.single("bukti")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Gagal upload file" });
    }

    try {
      const { keterangan, time } = req.body;

      if (!req.user?.nip) {
        return res
          .status(401)
          .json({ message: "NIP tidak ditemukan dari token user" });
      }

      const data = {
        nip: req.user.nip,
        keterangan,
        time,
      };

      await createPerizinanGuru(data, req.file); // req.file = file dari multer

      return res.status(201).json({
        message: "Berhasil membuat perizinan guru",
      });
    } catch (error) {
      console.error("Error createPerizinanGuruController:", error);
      return res.status(500).json({ message: error.message });
    }
  });
};
export const approvePerizinanGuru = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updateStatusPerizinanGuru(id, "disetujui");
    res.status(200).json({
      success: true,
      message: "Perizinan berhasil disetujui",
      data: updated,
    });
  } catch (error) {
    console.error("Gagal approve perizinan:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyetujui perizinan",
    });
  }
};

export const rejectPerizinanGuru = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updateStatusPerizinanGuru(id, "ditolak");
    res.status(200).json({
      success: true,
      message: "Perizinan berhasil ditolak",
      data: updated,
    });
  } catch (error) {
    console.error("Gagal reject perizinan:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menolak perizinan",
    });
  }
};

export const deletePerizinanGuruController = async (req, res, next) => {
  try {
    await deletePerizinanGuru(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus perizinan guru" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPerizinanGuruByIdController = async (req, res, next) => {
  try {
    const perizinanGuru = await getPerizinanGuruById(req.params.id);
    return res.status(200).json(perizinanGuru);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPerizinanGuruController = async (req, res) => {
  try {
    const {
      nama = "",
      nip = "",
      tanggal = "",
      page = "1",
      pageSize = "10",
    } = req.query;

    const result = await getPerizinanGuru({
      nama,
      nip,
      tanggal,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    res.json({
      success: true,
      message: "Data perizinan guru berhasil diambil",
      ...result,
    });
  } catch (error) {
    console.error("Gagal mengambil data perizinan guru:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};
