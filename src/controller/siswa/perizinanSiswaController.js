import {
  createPerizinanSiswa,
  deletePerizinanSiswa,
  getAllPerizinanSiswa,
  getPerizinanSiswaById,
  getPerizinanSiswaByIdKelas,
  getPerizinanSiswaByIdKelasToday,
  getPerizinanSiswaByIdSiswa,
  updatePerizinanSiswa,
  updateStatusPerizinanSiswa,
} from "../../services/siswa/perizinanSiswaService.js";
import memoryUpload from "../../utils/multer.js";

// ✅ Create
export const createPerizinanSiswaController = async (req, res) => {
  memoryUpload.single("image")(req, res, async (err) => {
    try {
      const data = {
        idSiswa: req.user.idGuru,
        idKelas: req.user.idKelas,
        time: req.body.time,
        enddate: req.body.enddate,
        keterangan: req.body.keterangan,
        bukti: req.file,
      };
      const newIzin = await createPerizinanSiswa(data);
      console.log("new izin : ",newIzin);
      res
        .status(201)
        .json({ message: "Perizinan berhasil diajukan", data: newIzin });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
  });
};

// ✅ Get All
export const getAllPerizinanSiswaController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.idSiswa) filter.idSiswa = req.query.idSiswa;
    if (req.query.status) filter.status = req.query.status;

    const data = await getAllPerizinanSiswa(filter);
    return res.json({ data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get by ID
export const getPerizinanSiswaByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getPerizinanSiswaById(id);

    if (!data)
      return res.status(404).json({ message: "Data izin tidak ditemukan" });

    return res.json({ data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPerizinanSiswaByIdSiswaController = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await getPerizinanSiswaByIdSiswa(idGuru);

    if (!data)
      return res.status(404).json({ message: "Data izin tidak ditemukan" });

    return res.json({ data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPerizinanSiswaByIdKelasController = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const data = await getPerizinanSiswaByIdKelas(idKelas);

    if (!data)
      return res.status(404).json({ message: "Data izin tidak ditemukan" });

    return res.json({ data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPerizinanSiswaByIdKelasTodayController = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const data = await getPerizinanSiswaByIdKelasToday(idKelas);

    return res.json({ data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Update
export const updatePerizinanSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updatePerizinanSiswa(id, req.body);
    return res.status(200).json({
      message: "Perizinan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateStatusPerizinanSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateStatusPerizinanSiswa(id, req.body.status);
    return res.status(200).json({
      message: "Perizinan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Delete
export const deletePerizinanSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePerizinanSiswa(id);
    return res.json({ message: "Perizinan berhasil dihapus" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
