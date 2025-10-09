import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

// Create ListKelas
export const createListKelas = async (namaKelas) => {
  try {
    return await prisma.listKelas.create({
      data: { namaKelas },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Delete ListKelas
export const deleteListKelas = async (id) => {
  try {
    return await prisma.listKelas.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllListKelas = async ({
  namaKelas = "",
  page = 1,
  pageSize = 10,
} = {}) => {
  try {
    const skip = (page - 1) * pageSize;
    const where = namaKelas
      ? {
          namaKelas: {
            contains: namaKelas,
            mode: "insensitive",
          },
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.listKelas.findMany({
        where,
        orderBy: { namaKelas: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.listKelas.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllListKelasInput = async () => {
  try {
    const data = await prisma.listKelas.findMany({});
    return data;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
