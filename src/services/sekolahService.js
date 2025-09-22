import { PrismaClient } from "@prisma/client";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createSekolah = async (data) => {
  const {
    nama,
    npsn,
    desa,
    kecamatan,
    kabupaten,
    provinsi,
    telephone,
    email,
    website,
    namaKepsek,
  } = data;

  try {
    await prisma.sekolah.create({
      data: {
        nama,
        npsn,
        desa,
        kas: 0,
        kecamatan,
        kabupaten,
        provinsi,
        telephone,
        email,
        website,
        namaKepsek,
      },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateSekolah = async (data, foto) => {
  const {
    nama,
    npsn,
    desa,
    kecamatan,
    kabupaten,
    provinsi,
    telephone,
    email,
    website,
    namaKepsek,
  } = data;

  try {
    const sekolah = await prisma.sekolah.findFirst({});
    if (!sekolah) {
      throw new Error("Sekolah dengan ID tersebut tidak ditemukan");
    }

    let imageUploadResult = null;
    if (foto && foto.buffer && foto.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "sekolah",
        nama
      );
    }

    console.log(nama);

    await prisma.sekolah.update({
      where: { id: sekolah.id },
      data: {
        nama,
        npsn,
        desa,
        kecamatan,
        kabupaten,
        provinsi,
        telephone,
        email,
        website,
        namaKepsek,
        logo: imageUploadResult?.secure_url,
        logoId: imageUploadResult?.public_id,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSekolah = async () => {
  try {
    const data = await prisma.sekolah.findFirst({});
    return data;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
