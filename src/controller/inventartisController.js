import {
  createInventaris,
  deleteInventaris,
  getInventarisById,
  updateInventaris,
} from "../services/inventarisService.js";

export const createInventarisController = async (req, res, next) => {
  try {
    await createInventaris(req.body);
    return res.status(201).json({ message: "Berhasil membuat inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateInventarisController = async (req, res, next) => {
  try {
    await updateInventaris(req.params.id, req.body);
    return res.status(200).json({ message: "Berhasil mengupdate inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteInventarisController = async (req, res, next) => {
  try {
    await deleteInventaris(req.params.id);
    return res.status(200).json({ message: "Berhasil menghapus inventaris" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInventarisByIdController = async (req, res, next) => {
  try {
    const inventaris = await getInventarisById(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan inventaris", data: inventaris });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
