import {
  bayarTagihan,
  createTagihan,
  deleteTagihan,
  getAllRiwayatPembayaran,
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

export const BayarTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bayarTagihan(id, req.body.metodeBayar);
    res.status(200).json({ message: "Tagihan berhasil Dibayar", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetAllRiwayatPembayaranController = async (req, res) => {
  try {
    const result = await getAllRiwayatPembayaran({
      namaSiswa: req.query.namaSiswa,
      namaTagihan: req.query.namaTagihan,
      nisSiswa: req.query.nisSiswa,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    res
      .status(200)
      .json({ message: "Berhasil Mendapatkan Data Tagihan", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
