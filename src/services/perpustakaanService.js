import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBukuPerpustakaan = async (data) => {
  const { nama, pengarang, penerbit, tahunTerbit, keterangan, stok } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.buku_Perpustakaan.create({
        data: { nama, pengarang, penerbit, tahunTerbit, keterangan, stok },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateBukuPerpustakaan = async (id, data) => {
  const { nama, pengarang, penerbit, tahunTerbit, keterangan, stok } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.buku_Perpustakaan.update({
        where: { id },
        data: { nama, pengarang, penerbit, tahunTerbit, keterangan, stok },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteBukuPerpustakaan = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.buku_Perpustakaan.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getBukuPerpustakaanById = async (id) => {
  const buku = await prisma.buku_Perpustakaan.findUnique({ where: { id } });
  if (!buku) {
    throw new Error("Buku perpustakaan tidak ditemukan");
  }
  return buku;
};

export const createPeminjaman = async (data) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.peminjaman_dan_Pengembalian.create({
        data: {
          idBbuku: data.idBuku,
          nis: data.nis,
          waktuPinjam: data.waktuPinjam,
          waktuKembali: data.waktuKembali,
          status: data.status,
          keterangan: data.keterangan,
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPeminjamanByNis = async (nis) => {
  const peminjaman = await prisma.peminjaman_dan_Pengembalian.findMany({
    where: { nis },
    include: {
      buku_Perpustakaan: true,
    },
  });
  if (!peminjaman) {
    throw new Error("Peminjaman buku perpustakaan tidak ditemukan");
  }
  return peminjaman;
};

export const updateStatusPeminjaman = async (id, status) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.peminjaman_dan_Pengembalian.update({
        where: { id },
        data: { status },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePeminjaman = async (id, data) => {
  const { idBuku, nis, waktuPinjam, waktuKembali, keterangan } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.peminjaman_dan_Pengembalian.update({
        where: { id },
        data: { idBuku, nis, waktuPinjam, waktuKembali, keterangan },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePeminjaman = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.peminjaman_dan_Pengembalian.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
