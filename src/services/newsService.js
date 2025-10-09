import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createNews = async (data) => {
  const { image, title, content, guruId } = data;
  try {
    let imageUploadResult = null;

    if (image && image.buffer && image.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", title);
    }
    const result = await prisma.news.create({
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
        title,
        content,
        guruId,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
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
    orderBy: { createdAt: "desc" },
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
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateNews = async (id, data) => {
  const { image, title, content } = data;

  try {
    let imageUploadResult = null;
    console.log("img", image);

    const oldNews = await prisma.news.findUnique({
      where: {
        id: id,
      },
    });

    if (image && image.buffer && image.buffer.length > 0) {
      if (oldNews.imageId) {
        try {
          await deleteFromCloudinary(oldNews.imageId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", title);
    }

    console.log(imageUploadResult);

    const updatedTestimoni = await prisma.news.update({
      where: { id },
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
        title,
        content,
      },
    });

    return updatedTestimoni;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteNews = async (id) => {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id: id,
      },
    });

    if (news.imageId) {
      try {
        await deleteFromCloudinary(oldTesti.imageId);
      } catch (error) {
        console.log(error);
      }
    }

    await prisma.news.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
