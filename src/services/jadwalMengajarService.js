import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createJadwalMengajar = async (data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const guru = await tx.guru.findUnique({
        where: { nip: data.nipGuru },
      });

      if (!guru) {
        throw new Error(`Guru dengan NIP ${data.nipGuru} tidak ditemukan`);
      }

      const jadwal = await tx.jadwalMengajar.create({
        data: {
          nipGuru: data.nipGuru,
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

      if (data.nipGuru) {
        const guru = await tx.guru.findUnique({
          where: { nip: data.nipGuru },
        });
        if (!guru) throw new Error("Guru tidak ditemukan");
      }

      const updated = await tx.jadwalMengajar.update({
        where: { id },
        data: {
          nipGuru: data.nipGuru,
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
