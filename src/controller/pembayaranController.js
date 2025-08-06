import {
  createTagihan,
  deleteTagihan,
  getAllTagihan,
  getTagihanById,
  updateTagihan,
} from "../services/pembayaranService.js";

export const CreateTagihanController = async (req, res) => {
  try {
    const data = req.body;
    const result = await createTagihan(data);
    res.status(201).json({ message: "Tagihan berhasil dibuat", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const GetAllTagihanController = async (req, res) => {
  try {
    const query = req.query;
    const result = await getAllTagihan(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetTagihanByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getTagihanById(id);
    if (!result) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UpdateTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await updateTagihan(id, data);
    res.status(200).json({ message: "Tagihan berhasil diupdate", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const DeleteTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteTagihan(id);
    res.status(200).json({ message: "Tagihan berhasil dihapus", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
