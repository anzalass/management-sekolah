import {
  createWeeklyActivity,
  deleteWeeklyActivity,
  getWeeklyActivityByIdKelas,
} from "../services/weeklyActivityService.js";

/**
 * Create WeeklyActivity
 */
export const createWeeklyActivityController = async (req, res) => {
  try {
    const { idKelas, content, waktu } = req.body;
    const files = req.files; // multer memoryUpload.array('foto')
    const result = await createWeeklyActivity(idKelas, content, waktu, files);
    res.status(201).json({ message: "WeeklyActivity created", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating WeeklyActivity", error: error.message });
  }
};

/**
 * Get WeeklyActivity by idKelas
 */
export const getWeeklyActivityByIdKelasController = async (req, res) => {
  try {
    const { idKelas } = req.user;
    const result = await getWeeklyActivityByIdKelas(idKelas);
    res.status(200).json({ data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WeeklyActivity", error: error.message });
  }
};

export const getWeeklyActivityByIdKelasGuruController = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const result = await getWeeklyActivityByIdKelas(idKelas);
    res.status(200).json({ data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WeeklyActivity", error: error.message });
  }
};

/**
 * Delete WeeklyActivity
 */
export const deleteWeeklyActivityController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteWeeklyActivity(id);
    res.status(200).json({ message: "WeeklyActivity deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting WeeklyActivity", error: error.message });
  }
};
