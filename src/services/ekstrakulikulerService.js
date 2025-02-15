import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createEkstraKulikuler = async (data) => {
  const { nama, waktu, jenis } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.ekstraKulikuler.create({
        data: { nama, waktu, jenis },
      });
    });

    return ekstraKulikuler;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateEkstraKulikuler = async (id, data) => {
  const { nama, waktu, jenis } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.ekstraKulikuler.update({
        where: { id },
        data: { nama, waktu, jenis },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteEkstraKulikuler = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.ekstraKulikuler.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEkstraKulikulerById = async (id) => {
  const ekstraKulikuler = await prisma.ekstraKulikuler.findUnique({
    where: { id },
  });

  if (!ekstraKulikuler) {
    throw new Error("Ekstra Kulikuler not found");
  }

  return ekstraKulikuler;
};
