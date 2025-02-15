import { updateSekolah } from "../services/sekolahService.js";

export const updateSekolahController = async (req, res) => {
  try {
    const { id } = req.params;
    await updateSekolah(id, req.body);
    return res
      .status(200)
      .json({ message: "Berjasil mengupdate informasi sekolah" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
