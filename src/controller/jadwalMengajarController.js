import {
  createJadwalMengajar,
  deleteJadwalMengajar,
  updateJadwalMengajar,
} from "../services/jadwalMengajarService.js";

export const createJadwalMengajarController = async (req, res) => {
  try {
    const jadwal = await createJadwalMengajar(req.body);
    return res.status(201).json({
      message: "Jadwal berhasil dibuat",
      data: jadwal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateJadwalMengajarController = async (req, res) => {
  try {
    const { id } = req.params;
    const jadwal = await updateJadwalMengajar(id, req.body);
    return res.status(200).json({
      message: "Jadwal berhasil diperbarui",
      data: jadwal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteJadwalMengajarController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteJadwalMengajar(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
