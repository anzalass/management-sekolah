import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();


export const createNews = async (data) => {
  const { image, title, content,guruId } = data;

  try {
    const result = await prisma.news.create({
      data: {
        image,
        title,
        content,
        guruId,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal membuat berita";
    throw new Error(errorMessage);
  }
};



export const getAllNews = async (page, pageSize, search) => {
  const skip = (page - 1) * pageSize;

  const data = await prisma.news.findMany({
    where: {
      title: {
        contains: search,
        mode: "insensitive", 
      },
    },
    skip: skip, 
    take: pageSize, 
  });

  const totalNews = await prisma.news.count({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  return {
    data,
    total: totalNews,
    page,
    pageSize,
    totalPages: Math.ceil(totalNews / pageSize),
  };
};


export const getNewsById = async (id) => {
  try {
    const testimoni = await prisma.news.findUnique({
      where: { id },
    });
    return testimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};



export const updateNews = async (id, data) => {
  const { image, title,content } = data;

  try {
    const updatedTestimoni = await prisma.news.update({
      where: { id },
      data: {
        image,
        title,
        content
      },
    });

    return updatedTestimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};


export const deleteNews = async (id) => {
  try {
    const deletedTestimoni = await prisma.news.delete({
      where: { id },
    });

    return deletedTestimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};