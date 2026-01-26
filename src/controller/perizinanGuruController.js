import {
  createPerizinanGuru,
  deletePerizinanGuru,
  getPerizinanGuru,
  getPerizinanGuruById,
  getPerizinanGuruByIdGuru,
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
        idGuru: req.user.idGuru,
        keterangan,
        time,
      };

      await createPerizinanGuru(data, req.file); // req.file = file dari multer

      return res.status(201).json({
        message: "Berhasil membuat perizinan guru",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  });
};
export const approvePerizinanGuru = async (req, res) => {
  const { id } = req.params;
  try {
    await updateStatusPerizinanGuru(id, "disetujui");
    return res.status(200).json({
      success: true,
      message: "Perizinan berhasil disetujui",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const rejectPerizinanGuru = async (req, res) => {
  const { id } = req.params;
  try {
    await updateStatusPerizinanGuru(id, "ditolak");
    res.status(200).json({
      success: true,
      message: "Perizinan berhasil ditolak",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePerizinanGuruController = async (req, res, next) => {
  try {
    await deletePerizinanGuru(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus perizinan guru", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPerizinanGuruByIdController = async (req, res, next) => {
  try {
    const perizinanGuru = await getPerizinanGuruById(req.params.id);
    return res.status(200).json(perizinanGuru);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPerizinanGuruController = async (req, res) => {
  try {
    const {
      nama = "",
      nip = "",
      startDate = "",
      endDate = "",
      page = "1",
      pageSize = "10",
    } = req.query;

    const result = await getPerizinanGuru({
      nama,
      nip,
      startDate,
      endDate,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    return res.json({
      success: true,
      message: "Data perizinan guru berhasil diambil",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPerizinanGuruByIdGuruController = async (req, res) => {
  try {
    const { idGuru, page = 1, pageSize = 10, startDate, endDate } = req.query;

    const result = await getPerizinanGuruByIdGuru({
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
