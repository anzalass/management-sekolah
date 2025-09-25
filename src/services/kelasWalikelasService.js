import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import {
  deleteWeeklyActivity,
  deleteWeeklyActivityIdKelas,
} from "./weeklyActivityService.js";
const prisma = new PrismaClient();

export const createKelasWaliKelas = async (data, banner) => {
  const { idGuru, nama, ruangKelas, namaGuru, nipGuru } = data;
  try {
    let imageUploadResult = null;

    if (banner && banner.buffer && banner.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        banner.buffer,
        "kelas",
        nama
      );
    }

    const tahunAjaran = await prisma.sekolah.findFirst();
    await prisma.$transaction(async (tx) => {
      await tx.kelas.create({
        data: {
          idGuru: idGuru,
          nama,
          ruangKelas,
          namaGuru,
          banner: imageUploadResult?.secure_url || "",
          bannerId: imageUploadResult?.public_id || "",
          nipGuru,
          tahunAjaran: tahunAjaran.tahunAjaran,
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateKelasWaliKelas = async (id, data, banner) => {
  const { nip, nama, ruangKelas, periode, guru } = data;

  try {
    let imageUploadResult = null;

    const oldKelas = await prisma.kelas.findUnique({
      where: {
        id: id,
      },
    });

    if (banner && banner.buffer && banner.buffer.length > 0) {
      if (oldKelas.bannerId) {
        try {
          await deleteFromCloudinary(oldKelas.bannerId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(
        banner.buffer,
        "kelas",
        nama
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.kelas.update({
        where: { id },
        data: {
          nip,
          nama,
          ruangKelas,
          periode,
          guru,
          banner: imageUploadResult?.secure_url || "",
          bannerId: imageUploadResult?.public_id || "",
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteKelasWaliKelas = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      // hapus semua siswa di kelas
      await deleteWeeklyActivityIdKelas(id);
      await tx.daftarSiswaKelas.deleteMany({
        where: {
          idKelas: id,
        },
      });

      // kalau ada pengumuman kelas juga harus dihapus
      await tx.pengumumanKelas.deleteMany({
        where: {
          idKelas: id,
        },
      });

      // hapus kelasnya
      await tx.kelas.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKelasWaliKelasById = async (id) => {
  const kelas = await prisma.kelas.findUnique({ where: { id } });
  if (!kelas) {
    throw new Error("Kelas wali kelas tidak ditemukan");
  }
  return kelas;
};

export const addSiswatoKelasWaliKelas = async (data) => {
  const { idKelas, namaSiswa, nisSiswa, idSiswa } = data;
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.daftarSiswaKelas.findFirst({
        where: { idKelas, idSiswa },
      });

      if (existing) {
        throw new Error("Siswa sudah terdaftar di kelas ini");
      }

      await tx.daftarSiswaKelas.create({
        data: {
          nisSiswa,
          idKelas,
          namaSiswa,
          idSiswa,
          rapotSiswa: "Belum Dibagikan",
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSiswaByIdKelas = async (idKelas) => {
  try {
    const siswaList = await prisma.daftarSiswaKelas.findMany({
      where: { idKelas },
      include: {
        Siswa: true, // Asumsikan relasi ke model siswa bernama `siswa`
      },
    });

    return siswaList;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteSiswatoKelasWaliKelas = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.daftarSiswaKelas.delete({
        where: { id: id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const rekapNilaiAbsensiSiswa = async (idSiswa, idKelas) => {
  // Ambil tahun ajaran aktif dari Sekolah (anggap 1 sekolah saja)
  const sekolah = await prisma.sekolah.findFirst();
  if (!sekolah) throw new Error("Sekolah tidak ditemukan");
  const tahunAjaranAktif = sekolah.tahunAjaran;

  // Ambil data siswa
  const siswa = await prisma.siswa.findUnique({
    where: { id: idSiswa },
    include: {
      DaftarSiswaMapel: {
        include: {
          KelasDanMapel: {
            include: {
              JenisNilai: true,
              NilaiSiswa: {
                where: { idSiswa },
              },
            },
            where: { tahunAjaran: tahunAjaranAktif },
          },
        },
      },
      KehadiranSiswa: {
        where: {
          idKelas,
        },
      },
    },
  });

  if (!siswa) throw new Error("Siswa tidak ditemukan");

  // Hitung nilai tiap mapel
  const nilaiMapel = siswa.DaftarSiswaMapel.map((ds) => {
    const mapel = ds.KelasDanMapel;
    if (!mapel) return null;

    let totalBobot = 0;
    let totalNilai = 0;

    mapel.JenisNilai.forEach((jn) => {
      const nilai = mapel.NilaiSiswa.find((n) => n.idJenisNilai === jn.id);
      if (nilai) {
        totalNilai += (nilai.nilai * jn.bobot) / 100;
        totalBobot += jn.bobot;
      }
    });

    return {
      mapel: mapel.namaMapel,
      guru: mapel.namaGuru,
      nilaiAkhir: totalBobot ? totalNilai.toFixed(2) : null,
    };
  }).filter(Boolean);

  // Hitung rekap absensi
  const totalKehadiran = siswa.KehadiranSiswa.length;
  const hadir = siswa.KehadiranSiswa.filter(
    (k) => k.keterangan.toLowerCase() === "hadir"
  ).length;
  const izin = siswa.KehadiranSiswa.filter(
    (k) => k.keterangan.toLowerCase() === "izin"
  ).length;
  const sakit = siswa.KehadiranSiswa.filter(
    (k) => k.keterangan.toLowerCase() === "sakit"
  ).length;
  const alpha = totalKehadiran - hadir - izin - sakit;

  return {
    siswa: {
      id: siswa.id,
      nama: siswa.nama,
      nis: siswa.nis,
      kelas: siswa.kelas,
    },
    nilai: nilaiMapel,
    absensi: {
      total: totalKehadiran,
      hadir,
      izin,
      sakit,
      alpha,
    },
  };
};

export const terbitkanRapot = async (id, value) => {
  try {
    await prisma.daftarSiswaKelas.update({
      where: {
        id,
      },
      data: {
        rapotSiswa: value,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
