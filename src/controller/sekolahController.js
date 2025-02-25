import { createSekolah, updateSekolah } from "../services/sekolahService.js";

export const createSekolahController = async (req, res) => {
  try {
    await createSekolah(req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate informasi sekolah" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateSekolahController = async (req, res) => {
  upload.single("foto")(req, res, async (err) => {
    try {
      const { id } = req.params;
      await updateSekolah(id, req.body, req.file);
      return res
        .status(200)
        .json({ message: "Berjasil mengupdate informasi sekolah" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};
