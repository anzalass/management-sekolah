import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createRuang = async (data) => {
  const { nama, keterangan } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ruangan.create({
        data: { nama, keterangan },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateRuang = async (id, data) => {
  const { nama, keterangan } = data;
  console.log("nama" + nama, "ket" + keterangan);

  try {
    await prisma.$transaction(async (tx) => {
      const updt = await tx.ruangan.update({
        where: { id: id },
        data: { nama, keterangan },
      });
      console.log("ID:", id);
      console.log("Data yang dikirim:", { nama, keterangan });
      console.log("Data setelah update:", updt);
      console.log(updt.result);
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteRuang = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ruangan.delete({ where: { id } });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getRuangById = async (id) => {
  const ruang = await prisma.ruangan.findUnique({ where: { id } });
  if (!ruang) {
    throw new Error("Ruang  tidak ditemukan");
  }
  return ruang;
};

export const getAllRuang2 = async () => {
  const ruang = await prisma.ruangan.findMany();
  return ruang;
};

export const getAllRuang = async ({ page = 1, pageSize = 10, nama = "" }) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};
    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }
    const data = await prisma.ruangan.findMany({
      skip,
      take,
      where,
    });

    const total = await prisma.ruangan.count({ where });
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    console.log(error);

    throw new Error(errorMessage);
  }
};
