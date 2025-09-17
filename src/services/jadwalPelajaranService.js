import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// CREATE Jadwal Pelajaran
export const createJadwalPelajaran = async (data) => {
  try {
    const jadwal = await prisma.jadwalPelajaran.create({
      data: {
        idKelas: data.idKelas,
        hari: data.hari,
        namaMapel: data.namaMapel,
        jamMulai: data.jamMulai,
        jamSelesai: data.jamSelesai,
      },
    });
    return jadwal;
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

// DELETE Jadwal Pelajaran
export const deleteJadwalPelajaran = async (id) => {
  try {
    const jadwal = await prisma.jadwalPelajaran.delete({
      where: { id },
    });
    return jadwal;
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const getJadwalPelajaranByIdKelas = async (idKelas) => {
  try {
    const jadwal = await prisma.jadwalPelajaran.findMany({
      where: { idKelas: idKelas },
    });

    console.log("jdwlservic", jadwal);

    return jadwal;
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};
