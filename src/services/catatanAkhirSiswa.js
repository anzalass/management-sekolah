import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// Create
export const createCatatanAkhirSiswa = async (data) => {
  try {
    return await prisma.catatanAkhirSiswa.create({
      data,
      include: {
        Siswa: true,
        KelasdanMapel: true,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Read All
export const getAllCatatanAkhirSiswa = async () => {
  try {
    return await prisma.catatanAkhirSiswa.findMany({
      include: {
        Siswa: true,
        KelasdanMapel: true,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Read By ID
export const getCatatanAkhirSiswaById = async (id) => {
  try {
    return await prisma.catatanAkhirSiswa.findUnique({
      where: { id },
      include: {
        Siswa: true,
        KelasdanMapel: true,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Update
export const updateCatatanAkhirSiswa = async (id, data) => {
  try {
    return await prisma.catatanAkhirSiswa.update({
      where: { id },
      data,
      include: {
        Siswa: true,
        KelasdanMapel: true,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Delete
export const deleteCatatanAkhirSiswa = async (id) => {
  try {
    return await prisma.catatanAkhirSiswa.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Get By idKelasMapel
export const getCatatanAkhirSiswaByKelasMapel = async (idKelasMapel) => {
  try {
    return await prisma.catatanAkhirSiswa.findMany({
      where: { idKelasMapel },
      include: {
        Siswa: true,
        KelasdanMapel: true,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
