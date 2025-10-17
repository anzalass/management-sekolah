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

export const getPengumumanKelasByGuru = async (idGuru) => {
  try {
    return await prisma.pengumumanKelas.findMany({
      where: { idGuru: idGuru },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllKelasAndMapelByGuruService = async (idGuru) => {
  try {
    const ta = await prisma.sekolah.findFirst({
      select: {
        tahunAjaran: true,
      },
    });
    // Ambil semua kelas berdasarkan idGuru
    const kelas = await prisma.kelas.findMany({
      where: { idGuru, tahunAjaran: ta.tahunAjaran },
      select: {
        id: true,
        nama: true,
      },
    });

    // Ambil semua mapel berdasarkan idGuru
    const mapel = await prisma.kelasDanMapel.findMany({
      where: { idGuru, tahunAjaran: ta.tahunAjaran },
      select: {
        id: true,
        namaMapel: true,
        kelas: true,
      },
    });

    // Gabungkan hasilnya menjadi satu array
    const result = [
      ...kelas.map((k) => ({
        id: k.id,
        nama: k.nama,
        type: "Kelas",
        tahunAjaran: k.tahunAjaran,
      })),
      ...mapel.map((m) => ({
        id: m.id,
        nama: m.namaMapel,
        type: "Mapel",
        kelas: m.kelas,
        tahunAjaran: m.tahunAjaran,
      })),
    ];

    return result;
  } catch (error) {
    console.error("Error getAllKelasAndMapelByGuruService:", error);
    throw new Error("Gagal mengambil data kelas dan mapel.");
  }
};
