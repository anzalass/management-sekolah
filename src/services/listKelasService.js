import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create ListKelas
export const createListKelas = async (namaKelas) => {
  return await prisma.listKelas.create({
    data: { namaKelas },
  });
};

// Delete ListKelas
export const deleteListKelas = async (id) => {
  return await prisma.listKelas.delete({
    where: { id },
  });
};

// Get All ListKelas (tambahan biar bisa dipakai di UI)
export const getAllListKelas = async ({
  namaKelas = "",
  page = 1,
  pageSize = 10,
} = {}) => {
  const skip = (page - 1) * pageSize;

  const where = namaKelas
    ? {
        namaKelas: {
          contains: namaKelas,
          mode: "insensitive",
        },
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.listKelas.findMany({
      where,
      orderBy: { namaKelas: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.listKelas.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
