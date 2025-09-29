import { getJadwalPelajaranByIdKelas } from "../../services/jadwalPelajaranService.js";
import * as siswaService from "../../services/siswa/siswaService.js";

export const getPembayaranRiwayatPembayaran = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPembayaranRiwayatPembayaranByIdSiswa(
      idGuru
    );
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getKelas = async (req, res) => {
  try {
    const { idSiswa } = req.params;
    const data = await siswaService.getKelasByIdSiswa(idSiswa);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getKelasMapel = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getKelasMapelByIdSiswa(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPresensi = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPresensiByIdSiswa(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerizinan = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPerizinanByIdSiswa(idSiswa);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPengumumanSiswa = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPengumuman(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRapot = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getRapotSiswa(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPelanggaran = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPelanggaranSiswa(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getPrestasi = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getPrestasiSiswa(idGuru);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardSiswa = async (req, res) => {
  try {
    const idSiswa = req.user.idGuru;
    const idKelas = req.user.idKelas;
    console.log(req.user.idKelas);

    const kelasAktif = await siswaService.getKelasMapelByIdSiswaRecent(idSiswa);
    const jadwalPelajaran = await getJadwalPelajaranByIdKelas(idKelas);
    const berandaInformasi = await siswaService.getPengumuman(idSiswa);

    console.log("jdwl", jadwalPelajaran);

    const result = {
      kelasAktif,
      jadwalPelajaran,
      berandaInformasi,
    };
    return res.json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNilaiSiswa = async (req, res) => {
  try {
    const { idGuru } = req.user;
    const data = await siswaService.getNilaiSiswaByTahun(idGuru);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerpustakaan = async (req, res) => {
  try {
    const data = await siswaService.getPerpustakaan();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
