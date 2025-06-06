import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createGallery = async (data) => {
  const { image,userId } = data;

  try {
    const result = await prisma.gallery.create({
      data: {
        image,
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


export const getAllGallery = async () => {
  try {
    const testimonis = await prisma.gallery.findMany();
    return testimonis;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimonies";
    throw new Error(errorMessage);
  }
};


export const getGalleryByid = async (id) => {
  try {
    const testimoni = await prisma.gallery.findUnique({
      where: { id },
    });
    return testimoni;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};



export const updateGallery = async (id, data) => {
  const { image } = data;

  try {
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        image,
      },
    });

    return updatedGallery;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};


export const deletedGallery = async (id) => {
  try {
    const deletedGallery = await prisma.gallery.delete({
      where: { id },
    });

    return deletedGallery;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};