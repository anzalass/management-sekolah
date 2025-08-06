import {
  createMateriMapel,
  createSummaryMateri,
  createTugasMapel,
  deleteMateriMapel,
  deleteSummaryMateri,
  deleteTugasMapel,
  getAllMateriMapel,
  getAllSummaryMateri,
  getAllTugasMapel,
  getMateriAndSummaryByMateriID,
  getMateriMapelById,
  getSummaryByMateriId,
  getSummaryMateriById,
  getTugasAndSummaryByTugasID,
  getTugasMapelById,
} from "../services/materiTugasSummaryService.js";
import fileUpload from "../utils/pdfUpload.js";

export const handleCreateMateriMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      console.log("pdf ctrlr", req.file);

      const result = await createMateriMapel(req.body, req.file);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const handleGetAllMateriMapel = async (req, res) => {
  try {
    const result = await getAllMateriMapel();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetMateriMapelById = async (req, res) => {
  try {
    const result = await getMateriMapelById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteMateriMapel = async (req, res) => {
  try {
    const result = await deleteMateriMapel(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Materi deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCreateSummaryMateri = async (req, res) => {
  try {
    const result = await createSummaryMateri(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetAllSummaryMateri = async (req, res) => {
  try {
    const result = await getAllSummaryMateri();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryMateriById = async (req, res) => {
  try {
    const result = await getSummaryMateriById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteSummaryMateri = async (req, res) => {
  try {
    const result = await deleteSummaryMateri(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Summary deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetSummaryByMateriId = async (req, res) => {
  try {
    const result = await getSummaryByMateriId(req.params.idMateri);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCreateTugasMapel = async (req, res) => {
  fileUpload.single("pdf")(req, res, async (err) => {
    try {
      console.log("pdf ctrlr", req.file);

      const result = await createTugasMapel(req.body, req.file);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const handleGetAllTugasMapel = async (req, res) => {
  try {
    const result = await getAllTugasMapel();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetTugasMapelById = async (req, res) => {
  try {
    const result = await getTugasMapelById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleDeleteTugasMapel = async (req, res) => {
  try {
    const result = await deleteTugasMapel(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Tugas deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetMateriAndSummaryByMateriID = async (req, res) => {
  try {
    const result = await getMateriAndSummaryByMateriID(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetTugasAndSummaryByTugasiID = async (req, res) => {
  try {
    const result = await getTugasAndSummaryByTugasID(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
