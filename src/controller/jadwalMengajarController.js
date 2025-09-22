import {
  createJadwalMengajar,
  deleteJadwalMengajar,
  getJadwalMengajarbyIDGuru,
  updateJadwalMengajar,
} from "../services/jadwalMengajarService.js";

export const createJadwalMengajarController = async (req, res) => {
  try {
    await createJadwalMengajar(req.body, req.user.idGuru);
    return res.status(201).json({
      message: "Jadwal berhasil dibuat",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateJadwalMengajarController = async (req, res) => {
  try {
    const { id } = req.params;
    await updateJadwalMengajar(id, req.body);
    return res.status(200).json({
      message: "Jadwal berhasil diperbarui",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteJadwalMengajarController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteJadwalMengajar(id);
    return res.status(200).json({
      message: "Jadwal berhasil dihapus",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getJadwalMengajarByIdGuruController = async (req, res) => {
  try {
    const data = await getJadwalMengajarbyIDGuru(req.user.idGuru);
    return res.status(200).json({
      message: "Jadwal berhasil didapatkan",
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
