import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createGuruTemplate = async (data) => {
  const { image, name, guruId } = data;

  try {
    let imageUploadResult;

    if (image && image.buffer && image.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", name);
    }
    const result = await prisma.guruTemplate.create({
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
        name,
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
    const errorMessage = prismaErrorHandler(error) || "Gagal membuat testimoni";
    throw new Error(errorMessage);
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
    const errorMessage =
      prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};

export const updateGuruTemplate = async (id, data) => {
  const { image, name } = data;

  try {
    let imageUploadResult = null;

    const oldTesti = await prisma.guruTemplate.findUnique({
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
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", name);
    }

    const result = await prisma.guruTemplate.update({
      where: { id },
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
        name,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal memperbarui testimoni";
    throw new Error(errorMessage);
  }
};

export const deletedGuruTemplate = async (id) => {
  try {
    const oldTesti = await prisma.guruTemplate.findUnique({
      where: { id },
    });
    if (oldTesti.imageId) {
      try {
        await deleteFromCloudinary(oldTesti.imageId);
      } catch (error) {
        console.log(error);
      }
    }

    const deletedGuruTemplate = await prisma.guruTemplate.delete({
      where: { id },
    });

    return deletedGuruTemplate;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};
