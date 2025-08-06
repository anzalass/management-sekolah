import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

export const createJenisNilai = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Cek total bobot
      const existingJenis = await tx.jenisNilai.findMany({
        where: { idKelasMapel: data.idKelasMapel },
      });

      const totalBobot =
        existingJenis.reduce((acc, item) => acc + item.bobot, 0) + data.bobot;

      if (totalBobot > 100) {
        throw new Error(`Total bobot melebihi 100% (current: ${totalBobot}%)`);
      }

      const isDuplicate = existingJenis.some(
        (item) => item.jenis === data.jenis
      );

      if (isDuplicate) {
        throw new Error(`Jenis nilai "${data.jenis}" sudah ada`);
      }
      // Buat jenis nilai baru
      const newJenis = await tx.jenisNilai.create({ data });

      // Ambil semua siswa dari kelas
      const kelas = await tx.kelasDanMapel.findUnique({
        where: { id: data.idKelasMapel },
        include: {
          DaftarSiswa: {
            include: { Siswa: true }, // jika kamu punya relasi ke siswa
          },
        },
      });

      if (!kelas) throw new Error("Kelas tidak ditemukan");

      // Buat array nilai siswa (semua nilai 0)
      const nilaiSiswaData = kelas.DaftarSiswa.map((item) => ({
        nisSiswa: item.nis,
        idKelasDanMapel: data.idKelasMapel,
        idJenisNilai: newJenis.id,
        jenisNilai: data.jenis,
        nilai: 0,
      }));

      // Simpan semua nilai siswa
      await tx.nilaiSiswa.createMany({ data: nilaiSiswaData });

      return newJenis;
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteJenisNilai = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Hapus dulu semua nilai siswa yang terkait dengan jenis nilai ini
      await tx.nilaiSiswa.deleteMany({
        where: { idJenisNilai: id },
      });

      // Baru hapus jenis nilainya
      const deleted = await tx.jenisNilai.delete({
        where: { id },
      });

      return deleted;
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ✅ Get JenisNilai by idKelasMapel (tanpa transaksi karena read-only)
export const getJenisNilaiByKelasMapel = async (idKelasMapel) => {
  try {
    return await prisma.jenisNilai.findMany({
      where: { idKelasMapel },
      orderBy: { jenis: "asc" },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateNilaiSiswa = async (id, data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.nilaiSiswa.update({
        where: { id },
        data: {
          nilai: data.nilai,
        },
      });
      return updated;
    });
    return result;
  } catch (error) {
    console.error("Error updating NilaiSiswa:", error);
    throw new Error("Gagal memperbarui nilai siswa");
  }
};

export const getAllNilaiSiswaByIdKelas = async (idKelasDanMapel) => {
  try {
    const nilaiSiswa = await prisma.nilaiSiswa.findMany({
      where: { idKelasDanMapel },
      select: {
        id: true,
        nisSiswa: true,
        idKelasDanMapel: true,
        idJenisNilai: true,
        jenisNilai: true,
        nilai: true,
        Siswa: {
          select: {
            nama: true,
          },
        },
      },
    });

    // flatten nama dari relasi Siswa ke properti utama
    return nilaiSiswa.map((item) => ({
      id: item.id,
      nisSiswa: item.nisSiswa,
      idKelasDanMapel: item.idKelasDanMapel,
      idJenisNilai: item.idJenisNilai,
      jenisNilai: item.jenisNilai,
      nama: item.Siswa?.nama || null,
      nilai: item.nilai,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data nilai siswa");
  }
};
