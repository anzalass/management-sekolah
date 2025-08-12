import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKelasMapel = async (data) => {
  const { idGuru, namaMapel, ruangKelas, kelas, nipGuru, namaGuru } = data;
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();

    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.create({
        data: {
          idGuru: idGuru,
          namaMapel,
          ruangKelas,
          nipGuru,
          namaGuru,
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
  const { namaMapel, ruangKelas, kelas } = data;
  console.log("rk", ruangKelas);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.update({
        where: { id },
        data: { namaMapel, ruangKelas, kelas },
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
      await tx.daftarSiswaMapel.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.summaryMateri.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.summaryTugas.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.nilaiSiswa.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.materiMapel.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.tugasMapel.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.jenisNilai.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.kelasDanMapel.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const addSiswatoKelasKelasMapel = async (data) => {
  const { idSiswa, idKelas, nisSiswa, namaSiswa } = data;
  try {
    await prisma.$transaction(async (tx) => {
      // Cek apakah siswa dengan NIS sudah ada di kelas ini
      const existing = await tx.daftarSiswaMapel.findFirst({
        where: {
          idSiswa,
          idKelas,
        },
      });

      if (existing) {
        throw new Error("Siswa dengan NIS tersebut sudah ada di dalam kelas.");
      }

      // Tambahkan siswa jika belum ada
      await tx.daftarSiswaMapel.create({
        data: { idKelas, namaSiswa, nisSiswa, idSiswa },
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
