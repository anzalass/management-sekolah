import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createGallery = async (data) => {
  const { image, guruId } = data;

  try {
    let imageUploadResult;

    if (image && image.buffer && image.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", guruId);
    }
    const result = await prisma.gallery.create({
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
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

export const getAllGallery = async () => {
  try {
    const testimonis = await prisma.gallery.findMany();
    return testimonis;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal mendapatkan testimonies";
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
    const errorMessage =
      prismaErrorHandler(error) || "Gagal mendapatkan testimoni";
    throw new Error(errorMessage);
  }
};

export const updateGallery = async (id, data) => {
  const { image } = data;

  try {
    let imageUploadResult = null;

    const gallery = await prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });

    if (image && image.buffer && image.buffer.length > 0) {
      if (gallery.imageId) {
        try {
          await deleteFromCloudinary(gallery.imageId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(image.buffer, "cms", id);
    }
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        image: imageUploadResult?.secure_url || "",
        imageId: imageUploadResult?.public_id || "",
      },
    });

    return updatedGallery;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal memperbarui gallery";
    throw new Error(errorMessage);
  }
};

export const deletedGallery = async (id) => {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });
    if (gallery.imageId) {
      try {
        await deleteFromCloudinary(gallery.imageId);
      } catch (error) {
        console.log(error);
      }
    }
    const deletedGallery = await prisma.gallery.delete({
      where: { id },
    });

    return deletedGallery;
  } catch (error) {
    console.error(error);
    const errorMessage =
      prismaErrorHandler(error) || "Gagal menghapus testimoni";
    throw new Error(errorMessage);
  }
};
