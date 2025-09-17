import {
  dashboardMengajarServicePage,
  dashboardOverview,
  dashboardKelasMapel,
  dashboardWaliKelas,
  getSideBarGuru,
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
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
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
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getSidebarMengajar = async (req, res) => {
  try {
    const result = await getSideBarGuru(req.user.idGuru);
    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
