import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createTestimoni = async (data) => {
  const { parentName, image, description, guruId } = data;

  try {
    let imageUploadResult;

    if (image && image.buffer && image.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        image.buffer,
        "cms",
        parentName
      );
    }

    console.log("service img", image);
    console.log("service img res", imageUploadResult);

    const result = await prisma.testimoni.create({
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
        parentName,
        description,
        guruId,
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
    const errorMessage =
      prismaErrorHandler(error) || "Gagal mendapatkan testimonies";
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
    const errorMessage =
      prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};

export const updateTestimoni = async (id, data) => {
  const { image, description, parentName } = data;

  try {
    let imageUploadResult = null;

    const oldTesti = await prisma.testimoni.findUnique({
      where: {
        id: id,
      },
    });

    if (image && image.buffer && image.buffer.length > 0) {
      if (oldTesti.imageId) {
        try {
          await deleteFromCloudinary(oldTesti.imageId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(
        image.buffer,
        "cms",
        parentName
      );
    }

    const updatedTestimoni = await prisma.testimoni.update({
      where: { id },
      data: {
        image: imageUploadResult?.secure_url,
        imageId: imageUploadResult?.public_id,
        parentName,
        description,
      },
    });

    return updatedTestimoni;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};

export const deleteTestimoni = async (id) => {
  try {
    const oldTesti = await prisma.testimoni.findUnique({
      where: { id },
    });
    if (oldTesti.imageId) {
      try {
        await deleteFromCloudinary(oldTesti.imageId);
      } catch (error) {
        console.log(error);
      }
    }

    await prisma.testimoni.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};
