import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createJadwalMengajar = async (data, idGuru) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const guru = await tx.guru.findUnique({
        where: { id: idGuru },
      });

      if (!guru) {
        throw new Error(`Guru dengan Id ${data.idGuru} tidak ditemukan`);
      }

      const jadwal = await tx.jadwalMengajar.create({
        data: {
          idGuru: idGuru,
          jamMulai: data.jamMulai,
          jamSelesai: data.jamSelesai,
          namaMapel: data.namaMapel,
          hari: data.hari,
          ruang: data.ruang,
          kelas: data.kelas,
        },
      });

      return jadwal;
    });

    return result;
  } catch (error) {
    console.log(error);

    throw prismaErrorHandler(error);
  }
};

export const updateJadwalMengajar = async (id, data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const jadwal = await tx.jadwalMengajar.findUnique({ where: { id } });

      if (!jadwal) {
        throw new Error("Jadwal tidak ditemukan");
      }

      if (data.idGuru) {
        const guru = await tx.guru.findUnique({
          where: { id: data.idGuru },
        });
        if (!guru) throw new Error("Guru tidak ditemukan");
      }

      const updated = await tx.jadwalMengajar.update({
        where: { id },
        data: {
          idGuru: data.idGuru,
          jamMulai: data.jamMulai,
          jamSelesai: data.jamSelesai,
          namaMapel: data.namaMapel,
          hari: data.hari,
          ruang: data.ruang,
        },
      });

      return updated;
    });

    return result;
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};

export const deleteJadwalMengajar = async (id) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const jadwal = await tx.jadwalMengajar.findUnique({ where: { id } });

      if (!jadwal) {
        throw new Error("Jadwal tidak ditemukan");
      }

      await tx.jadwalMengajar.delete({ where: { id } });

      return { message: "Jadwal berhasil dihapus" };
    });

    return result;
  } catch (error) {
    throw prismaErrorHandler(error);
  }
};
