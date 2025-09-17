import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
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
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
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
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteEkstraKulikuler = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.ekstraKulikuler.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
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
