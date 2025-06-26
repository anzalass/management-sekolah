import {
  createPerizinanGuru,
  deletePerizinanGuru,
  getPerizinanGuruById,
  updatePerizinanGuru,
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
export const updatePerizinanGuruController = async (req, res, next) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    try {
      await updatePerizinanGuru(req.params.id, req.body, req.file);
      return res
        .status(200)
        .json({ message: "Berhasil mengupdate perizinan guru" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
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
