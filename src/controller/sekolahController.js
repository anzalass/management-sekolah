import {
  createSekolah,
  getSekolah,
  updateSekolah,
} from "../services/sekolahService.js";
import memoryUpload from "../utils/multer.js";

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
  memoryUpload.single("foto")(req, res, async (err) => {
    try {
      console.log(req.file);

      await updateSekolah(req.body, req.file);
      return res
        .status(200)
        .json({ message: "Berjasil mengupdate informasi sekolah" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const getSekolahController = async (req, res) => {
  try {
    const data = await getSekolah();
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
