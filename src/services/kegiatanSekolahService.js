import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createKegiatanSekolah = async (data) => {
  const { nama, keterangan, waktuMulai, waktuSelesai, tahunAjaran } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.create({
        data: {
          nama,
          keterangan,
          tahunAjaran,
          waktuMulai: new Date(`${waktuMulai}T00:00:00Z`), // Tambah waktu default
          waktuSelesai: waktuSelesai
            ? new Date(`${waktuSelesai}T00:00:00Z`)
            : new Date(`${waktuMulai}T00:00:00Z`),
          status: "Belum Terlaksana",
        },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateKegiatanSekolah = async (id, data) => {
  const { nama, keterangan, waktuMulai, waktuSelesai, tahunAjaran } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.update({
        where: { id },
        data: { nama, keterangan, waktuMulai, waktuSelesai, tahunAjaran },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteKegiatanSekolah = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kegiatanSekolah.delete({ where: { id } });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
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
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllKegiatanSekolah = async ({
  nama,
  ta,
  pageSize = 10,
  page = 1,
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = 10;

    let where = {};
    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }
    if (ta) {
      where.tahunAjaran = { contains: ta, mode: "insensitive" };
    }

    const data = await prisma.kegiatanSekolah.findMany({
      skip,
      take,
      where,
    });

    const totalData = await prisma.kegiatanSekolah.count({
      where,
    });

    return {
      data,
      total: totalData,
      pageSize,
      page,
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
