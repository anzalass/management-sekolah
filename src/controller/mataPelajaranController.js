import {
  createMataPelajaran,
  deleteMataPelajaran,
  updateMataPelajaran,
} from "../services/mataPelajaranService.js";

export const createMataPelajaranController = async (req, res, next) => {
  try {
    await createMataPelajaran(req.body);
    return res.status(201).json({ message: "Berhasil membuat mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMataPelajaranController = async (req, res, next) => {
  try {
    await updateMataPelajaran(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMataPelajaranController = async (req, res, next) => {
  try {
    await deleteMataPelajaran(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus mata pelajaran" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMataPelajaranByIdController = async (req, res, next) => {
  try {
    const mataPelajaran = await getMataPelajaranById(req.params.id);
    return res.status(200).json({
      message: "Berhasil mendapatkan mata pelajaran",
      data: mataPelajaran,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
