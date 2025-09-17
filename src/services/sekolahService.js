import { PrismaClient } from "@prisma/client";
import { deleteFromImageKit, uploadToImageKit } from "../utils/ImageHandler.js";
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

export const updateSekolah = async (id, data, foto) => {
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
    const sekolah = await prisma.sekolah.findUnique({
      where: { id },
    });
    if (!sekolah) {
      throw new Error("Sekolah dengan ID tersebut tidak ditemukan");
    }

    let logoUploadResult = null;
    if (foto !== null) {
      await deleteFromImageKit(sekolah.logoId);
      logoUploadResult = await uploadToImageKit(logo, "sekolah");
    }
    await prisma.sekolah.update({
      where: { id },
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
        logo: logoUploadResult?.url,
        logoId: logoUploadResult?.fileId,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
