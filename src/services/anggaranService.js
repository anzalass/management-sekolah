import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createAnggaran = async (data) => {
  const { nama, keterangan, tanggal, jenis, jumlah } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.riwayatAnggaran.create({
        data: {
          nama,
          jumlah: parseInt(jumlah),
          keterangan,
          tanggal: new Date(`${tanggal}T00:00:00Z`),
          jenis,
        },
      });

      const kasSekolah = await tx.sekolah.findFirst({
        select: { kas: true },
      });

      if (jenis === "pemasukan") {
        await tx.sekolah.updateMany({
          data: {
            kas: kasSekolah.kas + parseInt(jumlah),
          },
        });
      } else if (jenis === "pengeluaran") {
        await tx.sekolah.updateMany({
          data: {
            kas: kasSekolah.kas - parseInt(jumlah),
          },
        });
      }
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateAnggaran = async (idAnggaran, data) => {
  const { nama, keterangan, tanggal, jenis, jumlah } = data;

  try {
    await prisma.$transaction(async (tx) => {
      // Ambil data sekolah dan riwayat anggaran
      const sekolah = await tx.sekolah.findFirst({
        select: { kas: true },
      });

      if (!sekolah) throw new Error("Sekolah tidak ditemukan");

      const riwayatAnggaran = await tx.riwayatAnggaran.findUnique({
        where: { id: idAnggaran },
        select: { jumlah: true, jenis: true },
      });
      if (!riwayatAnggaran) throw new Error("Riwayat anggaran tidak ditemukan");

      let kasBaru = sekolah.kas;

      // 1. Balikkan kas sekolah sesuai dengan jenis dan jumlah anggaran sebelumnya
      if (riwayatAnggaran.jenis === "pemasukan") {
        kasBaru -= riwayatAnggaran.jumlah;
      } else {
        kasBaru += riwayatAnggaran.jumlah;
      }

      // 2. Update kas sekolah sesuai dengan jenis dan jumlah baru
      if (jenis === "pemasukan") {
        kasBaru += jumlah;
      } else {
        kasBaru -= jumlah;
      }

      // 3. Cek apakah kas mencukupi
      if (kasBaru < 0) throw new Error("Kas sekolah tidak mencukupi");

      // 4. Update data riwayat anggaran dan kas sekolah
      await tx.riwayatAnggaran.update({
        where: { id: idAnggaran },
        data: {
          nama,
          keterangan,
          tanggal: new Date(`${tanggal}T00:00:00Z`),
          jenis,
          jumlah,
        },
      });

      await tx.sekolah.updateMany({
        data: { kas: kasBaru },
      });
    });

    return { message: "Anggaran berhasil diperbarui" };
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteAnggaran = async (idAnggaran) => {
  try {
    await prisma.$transaction(async (tx) => {
      const sekolah = await tx.sekolah.findFirst({
        select: { kas: true, id: true }, // ambil id-nya juga
      });

      if (!sekolah) throw new Error("Sekolah not found");

      const anggaran = await tx.riwayatAnggaran.findUnique({
        where: { id: idAnggaran },
        select: { jumlah: true, jenis: true },
      });

      if (!anggaran) throw new Error("Anggaran not found");

      let kasBaru = sekolah.kas;

      if (anggaran.jenis === "pemasukan") {
        kasBaru -= anggaran.jumlah;
      } else {
        kasBaru += anggaran.jumlah;
      }

      // Update kas sekolah di database
      await tx.sekolah.update({
        where: { id: sekolah.id },
        data: { kas: kasBaru },
      });

      // Hapus data anggaran
      await tx.riwayatAnggaran.delete({ where: { id: idAnggaran } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
;

export const getAnggaranById = async (id) => {
  const anggaran = await prisma.riwayatAnggaran.findUnique({ where: { id } });
  if (!anggaran) {
    throw new Error("Anggaran not found");
  }
  return anggaran;
};

export const getAllAnggaran = async ({
  page = 1,
  pageSize = 10,
  nama = "",
  jumlah,
  jenis,
  tanggal = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};
    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }
    if (jumlah) {
      where.jumlah = parseInt(jumlah);
    }
    if (tanggal) {
      where.tanggal = new Date(`${tanggal}T00:00:00Z`);
    }
    if (jenis) {
      where.jenis = { contains: jenis, mode: "insensitive" };
    }
    const data = await prisma.riwayatAnggaran.findMany({
      where,
      skip,
      take,
      orderBy: { tanggal: "desc" },
    });
    return {
      data,
      page,
      pageSize,
      total: await prisma.riwayatAnggaran.count({ where }),
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
