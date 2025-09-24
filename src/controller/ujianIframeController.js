import {
  createUjianIframeService,
  deleteSelesaiUjianById,
  deleteUjianIframeService,
  getAllUjianIframeService,
  getSelesaiUjian,
  getUjianIframeByIdGuruService,
  getUjianIframeByIdService,
  getUjianIframeByKelasMapelService,
  SelesaiUjianService,
  updateUjianIframeService,
} from "../services/ujianIframeService.js";

// CREATE
export const createUjianIframe = async (req, res) => {
  try {
    const { idKelasMapel, nama, deadline, iframe } = req.body;

    const ujian = await createUjianIframeService({
      idKelasMapel,
      nama,
      deadline,
      iframe,
    });

    return res.status(201).json({
      message: "Ujian iframe berhasil dibuat",
      data: ujian,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// GET ALL
export const getAllUjianIframe = async (req, res) => {
  try {
    const ujianList = await getAllUjianIframeService();
    return res.status(200).json(ujianList);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// GET BY ID
export const getUjianIframeById = async (req, res) => {
  try {
    const { id } = req.params;
    const ujian = await getUjianIframeByIdService(id);

    if (!ujian) {
      return res.status(404).json({ message: "Ujian iframe tidak ditemukan" });
    }

    return res.status(200).json(ujian);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const getUjianIframeByIdGuru = async (req, res) => {
  try {
    const { id } = req.params;
    const ujian = await getUjianIframeByIdGuruService(id);

    if (!ujian) {
      return res.status(404).json({ message: "Ujian iframe tidak ditemukan" });
    }

    return res.status(200).json(ujian);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// GET BY ID KELASMAPEL
export const getUjianIframeByKelasMapel = async (req, res) => {
  try {
    const { idKelasMapel } = req.params;
    const ujianList = await getUjianIframeByKelasMapelService(idKelasMapel);

    return res.status(200).json(ujianList);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// UPDATE
export const updateUjianIframe = async (req, res) => {
  try {
    const { id } = req.params;
    const { idKelasMapel, nama, deadline, iframe } = req.body;

    const ujian = await updateUjianIframeService(id, {
      idKelasMapel,
      nama,
      deadline,
      iframe,
    });

    return res.status(200).json({
      message: "Ujian iframe berhasil diperbarui",
      data: ujian,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// DELETE
export const deleteUjianIframe = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUjianIframeService(id);

    return res.status(200).json({ message: "Ujian iframe berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const selesaiUjianController = async (req, res) => {
  try {
    await SelesaiUjianService(req.body);
    return res.status(200).json({ message: " Berhasil mengumpulkan ujian" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const deleteSelesaiUjianController = async (req, res) => {
  try {
    await deleteSelesaiUjianById(req.params.id);
    return res.status(200).json({ message: " Berhasil mengumpulkan ujian" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const getSelesaiUjianController = async (req, res) => {
  try {
    const data = await getSelesaiUjian(
      req.body.idKelasMapel,
      req.body.idSiswa,
      req.body.idUjianIframe
    );
    return res
      .status(200)
      .json({ message: " Berhasil mendapatkan ujian", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
