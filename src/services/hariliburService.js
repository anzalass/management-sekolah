import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();
export const createHariLibur = async (data) => {
  const { namaHari, tanggal } = data;
  const ta = await prisma.sekolah.findFirst({
    select: {
      tahunAjaran: true,
    },
  });

  if (!tanggal) {
    throw new Error("Tanggal wajib diisi");
  }

  const parsedDate = new Date(tanggal);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Format tanggal tidak valid");
  }

  try {
    return await prisma.hariLibur.create({
      data: {
        namaHari,
        tahunAjaran: ta.tahunAjaran,
        tanggal: parsedDate,
      },
    });
  } catch (error) {
    console.log(error);

    throw new Error(prismaErrorHandler(error));
  }
};

/**
 * UPDATE
 */
export const updateHariLibur = async (id, data) => {
  const { namaHari, tanggal } = data;

  try {
    if (!tanggal) {
      throw new Error("Tanggal wajib diisi");
    }

    const ta = await prisma.sekolah.findFirst({
      select: {
        tahunAjaran: true,
      },
    });

    const parsedDate = new Date(tanggal);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Format tanggal tidak valid");
    }
    return await prisma.hariLibur.update({
      where: { id },
      data: {
        namaHari,
        tahunAjaran: ta.tahunAjaran,
        tanggal: parsedDate,
      },
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

/**
 * DELETE
 */
export const deleteHariLibur = async (id) => {
  try {
    return await prisma.hariLibur.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

/**
 * GET BY ID
 */
export const getHariLiburById = async (id) => {
  try {
    return await prisma.hariLibur.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

/**
 * GET ALL + PAGINATION + FILTER
 */
export const getHariLiburPaginated = async ({
  page = 1,
  size = 10,
  namaHari,
  tanggal,
}) => {
  try {
    const skip = (page - 1) * size;

    const where = {
      ...(namaHari && {
        namaHari: {
          contains: namaHari,
          mode: "insensitive",
        },
      }),
      ...(tanggal && {
        tanggal: {
          gte: new Date(`${tanggal}T00:00:00.000Z`),
          lt: new Date(`${tanggal}T23:59:59.999Z`),
        },
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.hariLibur.findMany({
        where,
        skip,
        take: size,
        orderBy: { tanggal: "desc" },
      }),
      prisma.hariLibur.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};
