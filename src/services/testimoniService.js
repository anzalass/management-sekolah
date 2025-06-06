import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createTestimoni = async (data) => {
  const { image, description,userId } = data;

  try {
    const result = await prisma.testimoni.create({
      data: {
        image,
        description,
        userId
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal membuat testimoni";
    throw new Error(errorMessage);
  }
};

export const getAllTestimoni = async (page, pageSize, search) => {
  try {
    const skip = (page - 1) * pageSize;

    const testimonis = await prisma.testimoni.findMany({
      where: {
        description: {
          contains: search,
          mode: "insensitive", 
        },
      },
      skip: skip,
      take: pageSize,
    });
    const totalTestimoni = await prisma.testimoni.count({
      where: {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return {
      data: testimonis,
      total: totalTestimoni,
      page,
      pageSize,
      totalPages: Math.ceil(totalTestimoni / pageSize),
    };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimonies";
    throw new Error(errorMessage);
  }
};



export const getTestimoniById = async (id) => {
  try {
    const testimoni = await prisma.testimoni.findUnique({
      where: { id },
    });
    return testimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};

export const updateTestimoni = async (id, data) => {
  const { image, description } = data;

  try {
    const updatedTestimoni = await prisma.testimoni.update({
      where: { id },
      data: {
        image,
        description,
      },
    });

    return updatedTestimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};


export const deleteTestimoni = async (id) => {
  try {
    const deletedTestimoni = await prisma.testimoni.delete({
      where: { id },
    });

    return deletedTestimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};
