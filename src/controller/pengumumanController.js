import {
  createPengumuman,
  deletePengumuman,
  getAllPengumuman,
  getPengumumanById,
  updatePengumuman,
} from "../services/pengumumanService.js";

export const createPengumumanController = async (req, res) => {
  try {
    const image = req.file ?? null;

    await createPengumuman({
      ...req.body,
      image, // 🔥 kirim file
    });

    return res.status(201).json({
      message: "Berhasil membuat pengumuman",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updatePengumumanController = async (req, res) => {
  try {
    const image = req.file ?? null;

    await updatePengumuman(req.params.id, {
      ...req.body,
      image,
    });

    return res.status(200).json({
      message: "Berhasil mengupdate pengumuman",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePengumumanController = async (req, res) => {
  try {
    await deletePengumuman(req.params.id);

    return res.status(200).json({
      message: "Berhasil menghapus pengumuman",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPengumumanByIdController = async (req, res, next) => {
  try {
    const pengumuman = await getPengumumanById(req.params.id);
    return res.status(200).json(pengumuman);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllPengumumanController = async (req, res, next) => {
  try {
    const result = await getAllPengumuman({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      title: req.query.title,
      time: req.query.time,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
