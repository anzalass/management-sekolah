import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js"; // Make sure this utility is correct

const prisma = new PrismaClient();

export const createPendaftaran = async (data) => {
  const {
    studentName,
    parentName,
    email,
    birthDay,
    phoneNumber,
    yourLocation,
    kategori,
  } = data;
  try {
    const result = await prisma.pendaftaranSiswa.create({
      data: {
        studentName,
        parentName,
        email,
        phoneNumber,
        birthDay: new Date(`${birthDay}T00:00:00Z`),
        yourLocation,
        kategori: kategori,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllPendaftaran = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const data = await prisma.pendaftaranSiswa.findMany({
      where: {
        studentName: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take,
    });

    const totalPendaftaran = await prisma.pendaftaranSiswa.count({
      where: {
        studentName: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return {
      data,
      total: totalPendaftaran,
      page,
      pageSize,
      totalPages: Math.ceil(totalPendaftaran / pageSize),
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPendaftaranById = async (id) => {
  try {
    const pendaftaran = await prisma.pendaftaranSiswa.findUnique({
      where: { id },
    });

    if (!pendaftaran) {
      throw new Error("Pendaftaran not found");
    }

    return pendaftaran;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updatePendaftaran = async (id, data) => {
  const { studentName, parentName, email, phoneNumber, yourLocation } = data;

  if (!studentName || !parentName || !email || !phoneNumber || !yourLocation) {
    throw new Error("All required fields must be provided.");
  }

  try {
    const updatedPendaftaran = await prisma.pendaftaranSiswa.update({
      where: { id },
      data: {
        studentName,
        parentName,
        email,
        phoneNumber,
        yourLocation,
      },
    });

    return updatedPendaftaran;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePendaftaran = async (id) => {
  try {
    const deletedPendaftaran = await prisma.pendaftaranSiswa.delete({
      where: { id },
    });

    return deletedPendaftaran;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
