import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// === MateriMapel ===

export const createMateriMapel = async (data) => {
  try {
    return await prisma.materiMapel.create({ data });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getAllMateriMapel = async () => {
  try {
    return await prisma.materiMapel.findMany({
      include: { SummaryMateri: true },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getMateriMapelById = async (id) => {
  try {
    return await prisma.materiMapel.findUnique({
      where: { id },
      include: { SummaryMateri: true, KelasMapel: true },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const deleteMateriMapel = async (id) => {
  try {
    return await prisma.materiMapel.delete({
      where: { id },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

// === SummaryMateri ===

export const createSummaryMateri = async (data) => {
  try {
    return await prisma.summaryMateri.create({ data });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getAllSummaryMateri = async () => {
  try {
    return await prisma.summaryMateri.findMany({
      include: { Siswa: true, MateriMapel: true },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getSummaryMateriById = async (id) => {
  try {
    return await prisma.summaryMateri.findUnique({
      where: { id },
      include: { Siswa: true, MateriMapel: true },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const deleteSummaryMateri = async (id) => {
  try {
    return await prisma.summaryMateri.delete({
      where: { id },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getSummaryByMateriId = async (idMateri) => {
  try {
    return await prisma.summaryMateri.findMany({
      where: { idMateri },
      include: {
        Siswa: true,
        MateriMapel: true,
      },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};
