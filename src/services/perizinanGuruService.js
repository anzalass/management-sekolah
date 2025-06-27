import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data, foto) => {
  try {
    const existingGuru = await prisma.guru.findUnique({
      where: { nip: data.nip },
    });
    if (!existingGuru) {
      throw new Error(`Guru dengan NIP ${data.nip} tidak ditemukan`);
    }
    let imageUploadResult = null;

    if (foto && foto.buffer) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "izinguru",
        data.nip
      );
    }

    await prisma.perizinanGuru.create({
      data: {
        nipGuru: data.nip,
        keterangan: data.keterangan,
        time: new Date(`${data.time}T00:00:00Z`),
        status: "menunggu",
        bukti: imageUploadResult?.secure_url ?? "", // pastikan tetap string
        bukti_id: imageUploadResult?.public_id ?? "",
      },
    });
  } catch (error) {
    console.log("a", error);
    throw new Error(error.message);
  }
};

export const updatePerizinanGuru = async (id, data) => {
  const { jenis, keterangan, timeEnd, time } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.update({
        where: { id },
        data: { jenis, keterangan, time, timeEnd },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePerizinanGuru = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPerizinanGuruById = async (id) => {
  const perizinanGuru = await prisma.perizinanGuru.findUnique({
    where: { id },
  });
  if (!perizinanGuru) {
    throw new Error("Perizinan Guru not found");
  }
  return perizinanGuru;
};
