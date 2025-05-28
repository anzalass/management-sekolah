import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAbsensiGurudanStaff = async (data) => {
  const { nip, latitude, longitude, tanggal } = data;

  try {
    await prisma.$transaction(async (tx) => {
      const wasAttendenceToday = await tx.kehadiran_Guru_Dan_Staff.findFirst({
        where: {
          nip,
          tanggal: {
            gte: new Date(tanggal).setHours(0, 0, 0, 0),
            lt: new Date(tanggal).setHours(23, 59, 59, 999),
          },
        },
      });

      if (wasAttendenceToday) {
        throw new Error("Anda sudah melakukan absensi hari ini.");
      }

      await tx.kehadiran_Guru_Dan_Staff.create({
        data: {
          nip,
          latitude,
          longitude,
          tanggal: new Date(tanggal),
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
