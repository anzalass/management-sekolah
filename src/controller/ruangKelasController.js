import {
  createRuangKelas,
  deleteRuangKelas,
  getRuangKelasById,
  updateRuangKelas,
} from "../services/ruangKelasService.js";

export const createRuangKelasController = async (req, res, next) => {
  try {
    await createRuangKelas(req.body);
    return res.status(201).json({ message: "Berhasil membuat ruang kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRuangKelasController = async (req, res, next) => {
  try {
    await updateRuangKelas(req.params.id, req.body);
    return res.status(200).json({ message: "Berhasil mengubah ruang kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRuangKelasController = async (req, res, next) => {
  try {
    await deleteRuangKelas(req.params.id);
    return res.status(200).json({ message: "Berhasil menghapus ruang kelas" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRuangKelasByIdController = async (req, res, next) => {
  try {
    const ruangKelas = await getRuangKelasById(req.params.id);
    return res.status(200).json(ruangKelas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
