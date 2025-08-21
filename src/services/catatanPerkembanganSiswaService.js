import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const createCatatan = async (data) => {
  try {
    return await prisma.catatanPerkembanganSiswa.create({
      data: {
        idKelas: data.idKelas,
        idSiswa: data.idSiswa,
        content: data.content,
        time: new Date(),
      },
    });
  } catch (error) {
    console.log(error);

    throw prismaErrorHandler(error);
  }
};

export const getAllCatatan = async () => {
  try {
    return await prisma.catatanPerkembanganSiswa.findMany({
      include: { Kelas: true, Siswa: true },
      orderBy: { time: "desc" },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getCatatanById = async (id) => {
  try {
    return await prisma.catatanPerkembanganSiswa.findUnique({
      where: { id },
      include: { Kelas: true, Siswa: true },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getCatatanByIdKelas = async (idKelas) => {
  try {
    const data = await prisma.catatanPerkembanganSiswa.findMany({
      where: { idKelas },
      include: {
        Kelas: true,
        Siswa: true,
      },
      orderBy: { time: "desc" },
    });

    return data.map((item) => ({
      id: item.id,
      idKelas: item.idKelas,
      idSiswa: item.idSiswa,
      content: item.content,
      time: item.time,
      kelasNama: item.Kelas?.nama || null,
      siswaNama: item.Siswa?.nama || null,
      nis: item.Siswa?.nis || null,
    }));
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const updateCatatan = async (id, data) => {
  try {
    return await prisma.catatanPerkembanganSiswa.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const deleteCatatan = async (id) => {
  try {
    return await prisma.catatanPerkembanganSiswa.delete({
      where: { id },
    });
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};
