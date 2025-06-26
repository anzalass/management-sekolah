import { dashboardMengajarServicePage } from "../services/pagesServices.js";

export const getDashboardMengajar = async (req, res) => {
  try {
    const nipGuru = req.user?.nip;

    if (!nipGuru)
      return res.status(401).json({ message: "NIP tidak ditemukan" });

    const result = await dashboardMengajarServicePage(nipGuru);

    return res.status(200).json({
      message: "Berhasil mendapatkan data dashboard",
      data: result,
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
