import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKelasMapel = async (data) => {
  const { nip, namaMapel, ruangKelas } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.create({
        data: { nip, namaMapel, ruangKelas, guru },
      });
    });
  } catch (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};

export const deleteKelasMapel = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addSiswatoKelasKelasMapel = async (data) => {
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

export const removeSiswaFromKelasMapel = async (id) => {
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
