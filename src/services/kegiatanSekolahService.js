import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKegiatanSekolah = async (data) => {
  const { nama, keterangan, time } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.create({
        data: { nama, keterangan, time, status },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateKegiatanSekolah = async (id, data) => {
  const { nama, keterangan, time } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.update({
        where: { id },
        data: { nama, keterangan, time },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteKegiatanSekolah = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getKegiatanSekolahById = async (id) => {
  const kegiatanSekolah = await prisma.kegiatanSekolah.findUnique({
    where: { id },
  });
  if (!kegiatanSekolah) {
    throw new Error("Kegiatan Sekolah tidak ditemukan");
  }
  return kegiatanSekolah;
};

export const updateStatusKegiatan = async (id, status) => {
  try {
    await prisma.kegiatanSekolah.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
