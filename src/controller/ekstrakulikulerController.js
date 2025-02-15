import {
  createEkstraKulikuler,
  deleteEkstraKulikuler,
  getEkstraKulikulerById,
  updateEkstraKulikuler,
} from "../services/ekstrakulikulerService.js";

export const createEkstraKulikulerController = async (req, res, next) => {
  try {
    await createEkstraKulikuler(req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat ekstra kulikuler", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEkstraKulikulerController = async (req, res, next) => {
  try {
    await updateEkstraKulikuler(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate ekstra kulikuler" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEkstraKulikulerController = async (req, res, next) => {
  try {
    await deleteEkstraKulikuler(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus ekstra kulikuler" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEkstraKulikulerByIdController = async (req, res, next) => {
  try {
    const result = await getEkstraKulikulerById(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan ekstra kulikuler", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
