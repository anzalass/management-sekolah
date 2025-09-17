import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createInventaris = async (data) => {
  const { nama, hargaBeli, waktuPengadaan, keterangan, ruang, quantity } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventaris.create({
        data: {
          nama,
          quantity: parseInt(quantity),
          hargaBeli: parseInt(hargaBeli),
          waktuPengadaan: new Date(`${waktuPengadaan}T00:00:00Z`),
          keterangan,
          ruang,
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateInventaris = async (id, data) => {
  const { nama, hargaBeli, waktuPengadaan, keterangan, quantity } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inventaris.update({
        where: { id },
        data: {
          nama,
          quantity: parseInt(quantity),
          hargaBeli: parseInt(hargaBeli),
          waktuPengadaan: new Date(`${waktuPengadaan}T00:00:00Z`),
          keterangan,
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteInventaris = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.pemeliharaan_Inventaris.deleteMany({
        where: { idinventaris: id },
      });

      await tx.inventaris.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getInventarisById = async (id) => {
  const inventaris = await prisma.inventaris.findUnique({ where: { id } });
  if (!inventaris) {
    throw new Error("Inventaris tidak ditemukan");
  }
  return inventaris;
};

export const getAllInventaris = async ({
  page = 1,
  pageSize = 10,
  nama = "",
  ruang = "",
  hargaBeli,
  waktuPengadaan = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};

    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }

    if (ruang) {
      where.ruang = { contains: ruang, mode: "insensitive" };
    }
    if (hargaBeli) {
      where.hargaBeli = parseInt(hargaBeli);
    }
    if (waktuPengadaan) {
      where.waktuPengadaan = new Date(`${waktuPengadaan}T00:00:00Z`);
    }

    const inventaris = await prisma.inventaris.findMany({
      where,
      skip,
      take,
    });

    return {
      data: inventaris,
      page,
      pageSize,
      count: await prisma.inventaris.count(),
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const createJenisInventaris = async (data) => {
  const { nama } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.jenis_Inventaris.create({
        data: { nama },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateJenisInventaris = async (id, data) => {
  const { nama } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.jenis_Inventaris.update({
        where: { id },
        data: { nama },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteJenisInventaris = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.jenis_Inventaris.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getJenisInventarisById = async (id) => {
  const jenisInventaris = await prisma.jenis_Inventaris.findUnique({
    where: { id },
  });
  if (!jenisInventaris) {
    throw new Error("Jenis Inventaris tidak ditemukan");
  }
  return jenisInventaris;
};

export const getAllInventaris2 = async () => {
  const inventaris = await prisma.jenis_Inventaris.findMany();
  return inventaris;
};

export const getAllJenisInventaris = async ({
  page = 1,
  pageSize = 10,
  nama = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};

    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }

    const jenisInventaris = await prisma.jenis_Inventaris.findMany({
      where,
      skip,
      take,
    });

    return {
      data: jenisInventaris,
      page,
      pageSize,
      totalData: await prisma.jenis_Inventaris.count(),
    };
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const createPemeliharaanInventaris = async (data) => {
  const { nama, hargaMaintenance, keterangan, quantity, idinventaris, status } =
    data;

  try {
    const inventaris = await prisma.inventaris.findUnique({
      where: { id: idinventaris }, // Cek apakah inventaris ada
    });

    if (!inventaris) {
      throw new Error("Inventaris tidak ditemukan");
    }

    const now = new Date();
    const tgl = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    tgl.setUTCHours(0, 0, 0, 0); // Set waktu ke 00:00:00 UTC

    await prisma.pemeliharaan_Inventaris.create({
      data: {
        tanggal: tgl,
        nama,
        biaya: status === "Sedang Maintenence" ? parseInt(hargaMaintenance) : 0,
        keterangan,
        ruang: inventaris.ruang,
        quantity: parseInt(quantity),
        status: status,
        Inventaris: {
          connect: { id: idinventaris },
        },
      },
    });

    await prisma.inventaris.update({
      where: { id: idinventaris },
      data: {
        quantity: inventaris.quantity - parseInt(quantity),
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updatePemeliharaanInventaris = async (id, data) => {
  const { nama, biaya, tanggal, keterangan, status } = data;
  try {
    await prisma.$transaction(async () => {
      await prisma.pemeliharaan_Inventaris.update({
        where: { id },
        data: { nama, biaya, tanggal, keterangan, status },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePemeliharaanInventaris = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.pemeliharaan_Inventaris.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPemeliharaanInventarisById = async (id) => {
  const pemeliharaanInventaris =
    await prisma.pemeliharaan_Inventaris.findUnique({
      where: { id },
    });
  if (!pemeliharaanInventaris) {
    throw new Error("Pemeliharaan Inventaris tidak ditemukan");
  }
  return pemeliharaanInventaris;
};

export const getAllPemeliharaanInventaris = async ({
  page = 1,
  pageSize = 10,
  nama = "",
  status = "",
  ruang = "",
  tanggal = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};

    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }
    if (status) {
      where.status = { contains: status, mode: "insensitive" };
    }
    if (ruang) {
      where.ruang = { contains: ruang, mode: "insensitive" };
    }

    if (tanggal) {
      where.tanggal = new Date(`${tanggal}T00:00:00Z`);
    }

    const pemeliharaanInventaris =
      await prisma.pemeliharaan_Inventaris.findMany({
        where,
        skip,
        take,
      });

    return {
      data: pemeliharaanInventaris,
      page,
      pageSize,
      count: await prisma.pemeliharaan_Inventaris.count(),
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateStatusPemeliharaan = async (id, status) => {
  try {
    await prisma.$transaction(async () => {
      const pemeliharaan = await prisma.pemeliharaan_Inventaris.findUnique({
        where: { id },
      });
      const inventaris = await prisma.inventaris.findUnique({
        where: { id: pemeliharaan.idinventaris },
      });

      await prisma.pemeliharaan_Inventaris.update({
        where: { id },
        data: { status: status },
      });
      await prisma.inventaris.update({
        where: { id: pemeliharaan.idinventaris },
        data: { quantity: inventaris.quantity + pemeliharaan.quantity },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
