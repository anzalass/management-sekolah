import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createRuangKelas = async (data) => {
  const { nama } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ruangKelas.create({
        data: { nama },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateRuangKelas = async (id, data) => {
  const { nama } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ruangKelas.update({
        where: { id },
        data: { nama },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteRuangKelas = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ruangKelas.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRuangKelasById = async (id) => {
  const ruangKelas = await prisma.ruangKelas.findUnique({ where: { id } });
  if (!ruangKelas) {
    throw new Error("Ruang Kelas tidak ditemukan");
  }
  return ruangKelas;
};
