import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKelasMapel = async (data) => {
  const { nip, namaMapel, ruangKelas, kelas } = data;
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();

    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.create({
        data: {
          nipGuru: nip,
          namaMapel,
          ruangKelas,
          kelas: kelas,
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

export const updateKelasMapel = async (id, data) => {
  const { namaMapel, ruangKelas } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.update({
        where: { id },
        data: { nip, namaMapel, ruangKelas },
      });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteKelasMapel = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const addSiswatoKelasKelasMapel = async (data) => {
  const { nis, idKelas } = data;
  try {
    await prisma.$transaction(async (tx) => {
      // Cek apakah siswa dengan NIS sudah ada di kelas ini
      const existing = await tx.daftarSiswaMapel.findFirst({
        where: {
          nis,
          idKelas,
        },
      });

      if (existing) {
        throw new Error("Siswa dengan NIS tersebut sudah ada di dalam kelas.");
      }

      // Tambahkan siswa jika belum ada
      await tx.daftarSiswaMapel.create({
        data: { nis, idKelas },
      });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const removeSiswaFromKelasMapel = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.daftarSiswaMapel.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Data tidak ditemukan, tidak bisa dihapus");
      }

      await tx.daftarSiswaMapel.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
