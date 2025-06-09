import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createGuruTemplate = async (data) => {
  const { image, name,userId } = data;

  try {
    const result = await prisma.guruTemplate.create({
      data: {
        image,
        name,
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


export const getGuruTemplate = async (page, pageSize, search) => {
  const skip = (page - 1) * pageSize;

  try {
    const data = await prisma.guruTemplate.findMany({
      where: {
        name: {
          contains: search, 
          mode: "insensitive", 
        },
      },
      skip: skip,
      take: pageSize,
    });

   
    const totalGuruTemplates = await prisma.guruTemplate.count({
      where: {
        name: {
          contains: search, 
          mode: "insensitive",
        },
      },
    });

    return {
      data,
      total: totalGuruTemplates,
      page,
      pageSize,
      totalPages: Math.ceil(totalGuruTemplates / pageSize), // Calculate the total pages
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data guru template");
  }
};


export const getGuruTemplateByid = async (id) => {
  try {
    const testimoni = await prisma.guruTemplate.findUnique({
      where: { id },
    });
    return testimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};


export const updateGuruTemplate = async (id, data) => {
  const { image, name } = data;

  try {
    const result = await prisma.guruTemplate.update({
      where: { id },
      data: {
        image,
        name
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};


export const deletedGuruTemplate = async (id) => {
  try {
    const deletedGuruTemplate = await prisma.guruTemplate.delete({
      where: { id },
    });

    return deletedGuruTemplate;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};