import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKelasWaliKelas = async (data) => {
  const { nip, nama, ruangKelas } = data;
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();
    await prisma.$transaction(async (tx) => {
      await tx.kelas.create({
        data: {
          nipGuru: nip,
          nama,
          ruangKelas,
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
  const { nis, idKelas } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.daftarSiswaKelas.create({
        data: { nis, idKelas },
      });
    });
  } catch (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};
