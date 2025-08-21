import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

export const createArsip = async (data, file) => {
  try {
    let UploadResult = null;
    console.log("filee service", file);

    if (file && file.buffer) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("File kosong saat dibaca dari buffer");
      }

      UploadResult = await uploadToCloudinary(
        file.buffer,
        "materi",
        data.judul
      );
    }

    console.log("upload res", UploadResult);

    const today = new Date();
    const dateOnly = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    ); // jam 00:00:00 UTC

    await prisma.$transaction(async (tx) => {
      await tx.arsip.create({
        data: {
          namaBerkas: data.namaBerkas,
          keterangan: data.keterangan,
          tanggal: dateOnly, // akan disimpan sebagai 00:00:00 UTC
          url: UploadResult?.secure_url,
          url_id: UploadResult?.public_id,
        },
      });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteArsip = async (id) => {
  try {
    const dataArsip = await prisma.arsip.findUnique({
      where: {
        id: id,
      },
    });

    const deleteArsipFromCloudinary = await deleteFromCloudinary(
      dataArsip.url_id
    );
    if (deleteArsipFromCloudinary) {
      await prisma.$transaction(async (tx) => {
        tx.arsip.delete({ where: { id: id } });
      });
    }
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllArsip = async ({
  page = 1,
  pageSize = 10,
  namaBerkas = "",
  keterangan = "",
  tanggal = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};
    if (namaBerkas) {
      where.namaBerkas = { contains: namaBerkas, mode: "insensitive" };
    }
    if (keterangan) {
      where.keterangan = { contains: namaBerkas, mode: "insensitive" };
    }

    if (tanggal) {
      where.tanggal = new Date(`${tanggal}T00:00:00Z`);
    }

    const data = await prisma.arsip.findMany({
      where,
      skip,
      take,
    });

    const totalData = await prisma.arsip.count();
    return {
      data,
      page,
      pageSize,
      totalData,
    };
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
