import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createPendaftaran = async (data) => {
  try {
    return await prisma.pendaftaranSiswa.create({
      data: {
        studentName: data.studentName,
        parentName: data.parentName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        yourLocation: data.yourLocation,
      },
    });
  } catch (error) {
    console.log(error);

    throw prismaErrorHandler(error);
  }
};

export const getAllPendaftaran = async ({
  page = 1,
  pageSize = 10,
  studentName = "",
  parentName = "",
  email = "",
  yourLocation = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = {};

    if (studentName) {
      where.studentName = { contains: studentName, mode: "insensitive" };
    }
    if (parentName) {
      where.parentName = { contains: parentName, mode: "insensitive" };
    }
    if (email) {
      where.email = { contains: email, mode: "insensitive" };
    }
    if (yourLocation) {
      where.yourLocation = { contains: yourLocation, mode: "insensitive" };
    }

    const data = await prisma.pendaftaranSiswa.findMany({
      where,
      skip,
      take,
      orderBy: { studentName: "asc" },
    });

    const total = await prisma.pendaftaranSiswa.count({ where });

    return {
      data,
      page,
      pageSize,
      total,
    };
  } catch (error) {
    const err = prismaErrorHandler(error);
    throw new Error(err.message || "Gagal mengambil data pendaftaran");
  }
};

export const getPendaftaranById = async (id) => {
  try {
    return await prisma.pendaftaranSiswa.findUnique({
      where: { id },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};
