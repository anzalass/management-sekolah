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
  getMateriMapelById,
  getSummaryByMateriId,
  getSummaryByTugasId,
  getSummaryMateriById,
  getSummaryTugasById,
  getTugasAndSummaryByTugasID,
  getTugasMapelById,
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
    const result = await createSummaryMateri(req.body);
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
    const result = await createSummaryTugas(req.body);
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
