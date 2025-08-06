import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// ===== BUAT BUKU =====
export const createBuku = async (data, file) => {
  const { nama, pengarang, penerbit, tahunTerbit, keterangan, stok } = data;
  let UploadResult = null;

  try {
    if (file && file.path) {
      const fileBuffer = await fs.readFile(file.path);

      if (fileBuffer.length === 0)
        throw new Error("File kosong saat dibaca dari disk");

      // Validasi ukuran file maksimal 5MB
      const maxSize = 5 * 1024 * 1024;
      if (fileBuffer.length > maxSize)
        throw new Error("Ukuran file melebihi 5MB");

      UploadResult = await uploadToCloudinary(fileBuffer, "buku", nama);
    }

    const result = await prisma.buku_Perpustakaan.create({
      data: {
        nama,
        pengarang,
        penerbit,
        tahunTerbit: parseInt(tahunTerbit),
        keterangan,
        stok: parseInt(stok),
        filepdf: UploadResult?.secure_url || null,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ===== GET ALL BUKU (dengan filter nama) =====
export const getAllBuku = async ({ nama }) => {
  try {
    const where = nama
      ? { nama: { contains: nama, mode: "insensitive" } }
      : undefined;

    return await prisma.buku_Perpustakaan.findMany({ where });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ===== HAPUS BUKU =====
export const deleteBuku = async (id) => {
  try {
    return await prisma.buku_Perpustakaan.delete({ where: { id } });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ===== PINJAM BUKU =====
export const pinjamBuku = async (data) => {
  const { nisSiswa, idBuku, waktuPinjam, waktuKembali, keterangan } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const buku = await tx.buku_Perpustakaan.findUnique({
        where: { id: idBuku },
      });
      if (!buku || buku.stok <= 0) throw new Error("Stok buku tidak mencukupi");

      const peminjaman = await tx.peminjaman_dan_Pengembalian.create({
        data: {
          nisSiswa,
          idBuku,
          waktuPinjam: new Date(waktuPinjam),
          waktuKembali: new Date(waktuKembali),
          status: "dipinjam",
          keterangan,
        },
      });

      await tx.buku_Perpustakaan.update({
        where: { id: idBuku },
        data: { stok: buku.stok - 1 },
      });

      return peminjaman;
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ===== KEMBALIKAN BUKU =====
export const kembalikanBuku = async (idPeminjaman) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman_dan_Pengembalian.findUnique({
        where: { id: idPeminjaman },
      });

      if (!peminjaman) throw new Error("Data peminjaman tidak ditemukan");
      if (peminjaman.status === "dikembalikan")
        throw new Error("Buku sudah dikembalikan");

      await tx.peminjaman_dan_Pengembalian.update({
        where: { id: idPeminjaman },
        data: { status: "dikembalikan" },
      });

      await tx.buku_Perpustakaan.update({
        where: { id: peminjaman.idBuku },
        data: { stok: { increment: 1 } },
      });

      return { message: "Buku berhasil dikembalikan" };
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePeminjamanDanPengembalian = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman_dan_Pengembalian.findUnique({
        where: { id },
      });

      if (!peminjaman) {
        throw new Error("Data peminjaman tidak ditemukan");
      }

      return await tx.peminjaman_dan_Pengembalian.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error("Gagal hapus peminjaman:", error);
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
