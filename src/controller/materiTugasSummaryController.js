import {
  createMateriMapel,
  createSummaryMateri,
  createSummaryTugas,
  createTugasMapel,
  deleteMateriMapel,
  deleteSummaryMateri,
  deleteSummaryTugas,
  deleteTugasMapel,
  getAllMateriMapel,
  getAllSummarTugas,
  getAllSummaryMateri,
  getAllTugasMapel,
  getMateriAndSummaryByMateriID,
  getMateriAndSummarySiswa,
  getMateriMapelById,
  getSummaryByMateriId,
  getSummaryByTugasId,
  getSummaryMateriById,
  getSummaryTugasById,
  getTugasAndSummaryByTugasID,
  getTugasAndSummarySiswa,
  getTugasMapelById,
  updateMateriMapel,
  updateTugasMapel,
} from "../services/materiTugasSummaryService.js";
import fileUpload from "../utils/pdfUpload.js";

export const handleCreateMateriMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      console.log("pdf ctrlr", req.file);

      const result = await createMateriMapel(req.body, req.file);
      return res.status(201).json({
        message: "Berhasil membuat materi",
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const handleUpdateMateriMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const file = req.file; // ambil dari multer

      const updatedMateri = await updateMateriMapel(id, data, file);

      return res.status(200).json({
        message: "Materi berhasil diperbarui",
        data: updatedMateri,
      });
    } catch (error) {
      console.error("Error update materi:", error);
      res.status(500).json({
        message: prismaErrorHandler(error) || "Gagal memperbarui materi",
      });
    }
  });
};

export const handleGetAllMateriMapel = async (req, res) => {
  try {
    const result = await getAllMateriMapel();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({
      message: "Berhasil mendapatkan materi",
      success: false,
      message: error.message,
    });
  }
};

export const handleGetMateriMapelById = async (req, res) => {
  try {
    const result = await getMateriMapelById(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteMateriMapel = async (req, res) => {
  try {
    const result = await deleteMateriMapel(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Materi deleted", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCreateSummaryMateri = async (req, res) => {
  try {
    const result = await createSummaryMateri(req.body, req.files);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetAllSummaryMateri = async (req, res) => {
  try {
    const result = await getAllSummaryMateri();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryMateriById = async (req, res) => {
  try {
    const result = await getSummaryMateriById(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteSummaryMateri = async (req, res) => {
  try {
    const result = await deleteSummaryMateri(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Summary deleted", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryByMateriId = async (req, res) => {
  try {
    const result = await getSummaryByMateriId(req.params.idMateri);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCreateTugasMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      await createTugasMapel(req.body, req.file);
      return res.status(201).json({
        message: "Berhasil membuat tugas",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const handleUpdateTugasMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Gagal upload file" });
      }

      const { id } = req.params;

      const updated = await updateTugasMapel(id, req.body, req.file);

      return res.status(200).json({
        message: "Berhasil memperbarui tugas",
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error("Error di handleUpdateTugasMapel:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Terjadi kesalahan",
      });
    }
  });
};

export const handleGetAllTugasMapel = async (req, res) => {
  try {
    const result = await getAllTugasMapel();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetTugasMapelById = async (req, res) => {
  try {
    const result = await getTugasMapelById(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteTugasMapel = async (req, res) => {
  try {
    await deleteTugasMapel(req.params.id);
    res.status(200).json({ success: true, message: "Tugas deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetMateriAndSummaryByMateriID = async (req, res) => {
  try {
    const result = await getMateriAndSummaryByMateriID(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetTugasAndSummaryByTugasiID = async (req, res) => {
  try {
    const result = await getTugasAndSummaryByTugasID(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCreateSummaryTugas = async (req, res) => {
  try {
    const result = await createSummaryTugas(req.body, req.files);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetAllSummaryTugas = async (req, res) => {
  try {
    const result = await getAllSummarTugas();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryTugasById = async (req, res) => {
  try {
    const result = await getSummaryTugasById(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteSummaryTugas = async (req, res) => {
  try {
    const result = await deleteSummaryTugas(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Summary deleted", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryByTugasId = async (req, res) => {
  try {
    const result = await getSummaryByTugasId(req.params.idTugas);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetMateriAndSummaryByMateriIdSiswa = async (req, res) => {
  try {
    const result = await getMateriAndSummarySiswa(
      req.params.idMateri,
      req.user.idGuru
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetTugasAndSummaryByTugasIdSiswa = async (req, res) => {
  try {
    const result = await getTugasAndSummarySiswa(
      req.params.idTugas,
      req.user.idGuru
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error.message });
  }
};
