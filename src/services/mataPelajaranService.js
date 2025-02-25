import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createMataPelajaran = async (data) => {
  const { nama, kelas, guru } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.create({
        data: { nama, kelas, guru },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateMataPelajaran = async (id, data) => {
  const { nama, kelas, guru } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.update({
        where: { id },
        data: { nama, kelas, guru },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteMataPelajaran = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.delete({ where: { id } });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getMataPelajaranById = async (id) => {
  const mataPelajaran = await prisma.mata_Pelajaran.findUnique({
    where: { id },
  });
  if (!mataPelajaran) {
    throw new Error("Mata Pelajaran not found");
  }
  return mataPelajaran;
};

export const getAllMataPelajaran = async ({
  page = 1,
  pageSize = 10,
  nama,
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};
    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }
    const data = await prisma.mata_Pelajaran.findMany({
      skip,
      take,
      where,
    });
    const total = await prisma.mata_Pelajaran.count({ where });
    return { data, total, page, pageSize };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
