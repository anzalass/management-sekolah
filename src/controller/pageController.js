import {
  dashboardMengajarServicePage,
  dashboardOverview,
  dashboardKelasMapel,
  dashboardWaliKelas,
} from "../services/pagesServices.js";

export const getDashboardMengajar = async (req, res) => {
  try {
    const idGuru = req.user?.idGuru;

    if (!idGuru)
      return res.status(401).json({ message: "NIP tidak ditemukan" });

    const result = await dashboardMengajarServicePage(idGuru);

    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDashboardOverview = async (req, res) => {
  try {
    const result = await dashboardOverview();
    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDashboardKelasMapel = async (req, res) => {
  try {
    const result = await dashboardKelasMapel(req.params.idKelas);
    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDashboardWaliKelas = async (req, res) => {
  try {
    const result = await dashboardWaliKelas(req.params.idKelas);
    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
