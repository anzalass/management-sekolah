import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createMataPelajaran = async (data) => {
  const { nama, kelas, guruId } = data;
  try {
    const result = await prisma.mata_Pelajaran.create({
      data: {
        nama,
        kelas,
        idGuru: guruId,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateMataPelajaran = async (id, data) => {
  const { nama, kelas, guruId } = data;
  try {
    const result = await prisma.mata_Pelajaran.update({
      where: { id },
      data: {
        nama,
        kelas,
        guruId, // update guru juga bisa
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getMataPelajaranById = async (id) => {
  try {
    const mataPelajaran = await prisma.mata_Pelajaran.findUnique({
      where: { id },
      include: {
        Guru: true, // ambil data guru nya juga
      },
    });
    if (!mataPelajaran) {
      throw new Error("Mata Pelajaran not found");
    }
    return mataPelajaran;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllMataPelajaran = async ({
  page = 1,
  pageSize = 10,
  nama,
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let where = {};
    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }

    const data = await prisma.mata_Pelajaran.findMany({
      skip,
      take,
      where,
      include: {
        Guru: true, // ambil guru nya juga
      },
    });

    const total = await prisma.mata_Pelajaran.count({ where });

    return { data, total, page, pageSize };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteMataPelajaran = async (id) => {
  try {
    const result = await prisma.mata_Pelajaran.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
