import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createTagihan = async (data) => {
  try {
    const { opsi, ...tagihanData } = data;

    return await prisma.$transaction(async (tx) => {
      let siswaList = [];

      if (opsi === "semua") {
        siswaList = await tx.siswa.findMany({
          where: { status: { not: "Lulus" } },
        });
      } else if (opsi === "kelas") {
        siswaList = await tx.siswa.findMany({
          where: {
            kelas: {
              contains: tagihanData.kelas || "",
              mode: "insensitive",
            },
          },
        });
      } else if (opsi === "individu") {
        const siswa = await tx.siswa.findUnique({
          where: { nis: tagihanData.nisSiswa },
        });
        if (siswa) siswaList.push(siswa);
      }

      if (!siswaList.length) throw new Error("Tidak ada siswa ditemukan");

      const tagihanArray = siswaList.map((siswa) => ({
        ...tagihanData,
        nisSiswa: siswa.nis,
      }));

      return await tx.tagihan.createMany({ data: tagihanArray });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllTagihan = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const { nama, namaSiswa } = query;

    const whereClause = {};

    if (nama) {
      whereClause.nama = {
        contains: nama,
        mode: "insensitive",
      };
    }

    if (namaSiswa) {
      whereClause.Siswa = {
        nama: {
          contains: namaSiswa,
          mode: "insensitive",
        },
      };
    }

    const total = await prisma.tagihan.count({
      where: whereClause,
    });

    const data = await prisma.tagihan.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: whereClause,
      include: {
        Siswa: true,
      },
      orderBy: {
        waktu: "desc",
      },
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getTagihanById = async (id) => {
  try {
    return await prisma.tagihan.findUnique({
      where: { id },
      include: { Siswa: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateTagihan = async (id, data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      return await tx.tagihan.update({
        where: { id },
        data,
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteTagihan = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      return await tx.tagihan.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
