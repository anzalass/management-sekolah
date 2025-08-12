import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKelasWaliKelas = async (data) => {
  const { idGuru, nama, ruangKelas, namaGuru, nipGuru } = data;
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();
    await prisma.$transaction(async (tx) => {
      await tx.kelas.create({
        data: {
          idGuru: idGuru,
          nama,
          ruangKelas,
          namaGuru,
          nipGuru,
          tahunAjaran: tahunAjaran.tahunAjaran,
        },
      });
    });
  } catch (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const updateKelasWaliKelas = async (id, data) => {
  const { nip, nama, ruangKelas, periode, guru } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelas.update({
        where: { id },
        data: { nip, nama, ruangKelas, periode, guru },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteKelasWaliKelas = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      tx.daftarSiswaKelas.deleteMany({
        where: {
          idKelas: id,
        },
      });

      tx.pengumumanKelas.findMany({
        where: {
          idKelas: id,
        },
      });

      await tx.kelas.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
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
        data: { nisSiswa, idKelas, namaSiswa, idSiswa },
      });
    });
  } catch (error) {
    console.log(error);

    throw new Error(error.message || "Gagal menambahkan siswa ke kelas");
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
    throw new Error("Gagal mengambil data siswa dari kelas");
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

    throw new Error(error.message);
  }
};
