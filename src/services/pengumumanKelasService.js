import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createPengumumanKelas = async (data) => {
  try {
    return await prisma.pengumumanKelas.create({ data });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllPengumumanKelas = async () => {
  try {
    return await prisma.pengumumanKelas.findMany({
      include: { Kelas: true },
      orderBy: { time: "desc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumumanKelasById = async (id) => {
  try {
    return await prisma.pengumumanKelas.findUnique({
      where: { id },
      include: { Kelas: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updatePengumumanKelas = async (id, data) => {
  try {
    return await prisma.pengumumanKelas.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePengumumanKelas = async (id) => {
  try {
    return await prisma.pengumumanKelas.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumumanKelasByKelasId = async (idKelas) => {
  try {
    return await prisma.pengumumanKelas.findMany({
      where: { idKelas: idKelas },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
