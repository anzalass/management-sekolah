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
    let imageUrl;
    let imageId;

    // 🔍 ambil data lama
    const oldNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!oldNews) {
      throw new Error("News tidak ditemukan");
    }

    // default pakai gambar lama
    imageUrl = oldNews.image;
    imageId = oldNews.imageId;

    // 🔄 jika upload gambar baru
    if (image && image.buffer && image.buffer.length > 0) {
      // hapus gambar lama
      if (oldNews.imageId) {
        try {
          await deleteFromCloudinary(oldNews.imageId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }

      // upload gambar baru
      const uploadResult = await uploadToCloudinary(image.buffer, "cms", title);

      imageUrl = uploadResult.secure_url;
      imageId = uploadResult.public_id;
    }

    // 🔥 update data
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        image: imageUrl,
        imageId: imageId,
      },
    });

    return updatedNews;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal memperbarui berita";
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
        await deleteFromCloudinary(news.imageId);
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
