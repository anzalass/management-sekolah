import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js"; // Make sure this utility is correct

const prisma = new PrismaClient();

export const createPendaftaran = async (data) => {
  const { studentName, parentName, email, phoneNumber, yourLocation } = data;
  try {
    const result = await prisma.pendaftaranSiswa.create({
      data: {
        studentName,
        parentName,
        email,
        phoneNumber,
        yourLocation,
      },
    });
    return result;
  } catch (error) {
    console.error("Error creating Pendaftaran:", error);
    const errorMessage = prismaErrorHandler(error) || "Gagal membuat pendaftaran";
    throw new Error(errorMessage);
  }
};

export const getAllPendaftaran = async (page = 1, pageSize = 10, search = '') => {
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
    console.error('Error fetching all pendaftaran:', error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mengambil data pendaftaran";
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
    console.error("Error fetching pendaftaran by ID:", error);
    const errorMessage = prismaErrorHandler(error) || "Gagal mendapatkan pendaftaran";
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
    console.error("Error updating pendaftaran:", error);
    const errorMessage = prismaErrorHandler(error) || "Gagal memperbarui pendaftaran";
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
    console.error("Error deleting pendaftaran:", error);
    const errorMessage = prismaErrorHandler(error) || "Gagal menghapus pendaftaran";
    throw new Error(errorMessage);
  }
};
