import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createInventaris = async (data) => {
  const { nama, hargaBeli, waktuPengadaan, keterangan } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventaris.create({
        data: { nama, hargaBeli, waktuPengadaan, keterangan },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateInventaris = async (id, data) => {
  const { nama, hargaBeli, waktuPengadaan, keterangan } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventaris.update({
        where: { id },
        data: { nama, hargaBeli, waktuPengadaan, keterangan },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteInventaris = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventaris.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getInventarisById = async (id) => {
  const inventaris = await prisma.inventaris.findUnique({ where: { id } });
  if (!inventaris) {
    throw new Error("Inventaris tidak ditemukan");
  }
  return inventaris;
};
