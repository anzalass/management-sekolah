import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.create({
        data: {
          nip: data.nip,
          jenis: data.jenis,
          keterangan: data.keterangan,
          time: data.time,
          timeEnd: data.timeEnd,
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePerizinanGuru = async (id, data) => {
  const { jenis, keterangan, timeEnd, time } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.update({
        where: { id },
        data: { jenis, keterangan, time, timeEnd },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePerizinanGuru = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPerizinanGuruById = async (id) => {
  const perizinanGuru = await prisma.perizinanGuru.findUnique({
    where: { id },
  });
  if (!perizinanGuru) {
    throw new Error("Perizinan Guru not found");
  }
  return perizinanGuru;
};
