import { getKehadiranGuruByIdGuru } from "../services/KehadiranGurudanStaff.js";
import {
  dashboardMengajarServicePage,
  dashboardOverview,
  dashboardKelasMapel,
  dashboardWaliKelas,
  getSideBarGuru,
} from "../services/pagesServices.js";
import { getPerizinanGuruByIdGuru } from "../services/perizinanGuruService.js";

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
    const result = await getSideBarGuru(req.user.idGuru, req.user.jabatan);
    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const perizinanKehadiranByBuru = async (req, res) => {
  try {
    const {
      idGuru,
      pageKehadiran = 1,
      pageSizeKehadiran = 10,
      startDateKehadiran,
      endDateKehadiran,
      pagePerizinan = 1,
      pageSizePerizinan = 10,
      startDatePerizinan,
      endDatePerizinan,
    } = req.query;

    const resultKehadiran = await getKehadiranGuruByIdGuru({
      idGuru,
      page: pageKehadiran,
      pageSize: pageSizeKehadiran,
      startDate: startDateKehadiran,
      endDate: endDateKehadiran,
    });

    const resultPerizinan = await getPerizinanGuruByIdGuru({
      idGuru,
      page: pagePerizinan,
      pageSize: pageSizePerizinan,
      startDate: startDatePerizinan,
      endDate: endDatePerizinan,
    });

    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      resultPerizinan,
      resultKehadiran,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
