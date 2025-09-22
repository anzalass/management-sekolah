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
    await createTagihan(data);
    res.status(201).json({ message: "Tagihan berhasil dibuat" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const GetAllTagihanController = async (req, res) => {
  try {
    const query = req.query;
    const result = await getAllTagihan(query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const GetTagihanByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getTagihanById(id);
    if (!result) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const UpdateTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateTagihan(id, data);
    return res.status(200).json({ message: "Tagihan berhasil diupdate" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const DeleteTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteTagihan(id);
    return res.status(200).json({ message: "Tagihan berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const BayarTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    await bayarTagihan(id, req.body.metodeBayar);
    return res.status(200).json({ message: "Tagihan berhasil Dibayar" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
  }
};
