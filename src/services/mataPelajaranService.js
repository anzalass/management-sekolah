import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createMataPelajaran = async (data) => {
  const { nama, kelas, guru } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.create({
        data: { nama, kelas, guru },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMataPelajaran = async (id, data) => {
  const { nama, kelas, guru } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.update({
        where: { id },
        data: { nama, kelas, guru },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMataPelajaran = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.mata_Pelajaran.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMataPelajaranById = async (id) => {
  const mataPelajaran = await prisma.mata_Pelajaran.findUnique({
    where: { id },
  });
  if (!mataPelajaran) {
    throw new Error("Mata Pelajaran not found");
  }
  return mataPelajaran;
};
