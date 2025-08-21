import { PrismaClient } from "@prisma/client";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// ===== BUAT BUKU =====
export const createBuku = async (data, file) => {
  const { nama, pengarang, penerbit, tahunTerbit, keterangan, stok } = data;
  let UploadResult = null;

  try {
    if (file && file.buffer) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("File kosong saat dibaca dari buffer");
      }

      UploadResult = await uploadToCloudinary(file.buffer, "buku", nama);
    }

    console.log("srvice", file);

    const result = await prisma.buku_Perpustakaan.create({
      data: {
        nama,
        pengarang,
        penerbit,
        tahunTerbit: parseInt(tahunTerbit),
        keterangan,
        stok: parseInt(stok),
        filepdf: UploadResult?.secure_url || null,
        filePdfid: UploadResult?.public_id,
      },
    });

    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateBuku = async (id, data, file) => {
  const { nama, pengarang, penerbit, tahunTerbit, keterangan, stok } = data;
  let UploadResult = null;

  try {
    // cek buku dulu
    const buku = await prisma.buku_Perpustakaan.findUnique({
      where: { id },
    });

    if (!buku) {
      throw new Error("Buku tidak ditemukan");
    }

    // kalau ada file baru
    if (file && file.buffer) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("File kosong saat dibaca dari buffer");
      }

      // hapus file lama di cloudinary kalau ada
      if (buku.filePdfid) {
        await deleteFromCloudinary(buku.filePdfid);
      }

      // upload file baru
      UploadResult = await uploadToCloudinary(file.buffer, "buku", nama);
    }

    // update ke db
    const result = await prisma.buku_Perpustakaan.update({
      where: { id },
      data: {
        nama,
        pengarang,
        penerbit,
        tahunTerbit: parseInt(tahunTerbit),
        keterangan,
        stok: parseInt(stok),
        ...(UploadResult && {
          filepdf: UploadResult.secure_url,
          filePdfid: UploadResult.public_id,
        }),
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
export const getAllBuku = async ({ nama = "", page = 1, pageSize = 10 }) => {
  try {
    const skip = (page - 1) * pageSize;

    const where = nama ? { nama: { contains: nama, mode: "insensitive" } } : {};

    const [data, total] = await Promise.all([
      prisma.buku_Perpustakaan.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { nama: "asc" }, // biar rapi
      }),
      prisma.buku_Perpustakaan.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ===== HAPUS BUKU =====
export const deleteBuku = async (id) => {
  try {
    const buku = await prisma.buku_Perpustakaan.findUnique({
      where: {
        id: id,
      },
    });

    if (!buku) {
      throw new Error("Buku tidak ditemukan");
    }

    await deleteFromCloudinary(buku.filePdfid);
    await prisma.buku_Perpustakaan.delete({ where: { id: buku.id } });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getBukuById = async (id) => {
  try {
    return await prisma.buku_Perpustakaan.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
// ===== PINJAM BUKU =====
export const pinjamBuku = async (data) => {
  const {
    nisSiswa,
    namaBuku,
    idSiswa,
    idBuku,
    waktuPinjam,
    waktuKembali,
    keterangan,
  } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const buku = await tx.buku_Perpustakaan.findUnique({
        where: { id: idBuku },
      });
      if (!buku || buku.stok <= 0) throw new Error("Stok buku tidak mencukupi");

      const peminjaman = await tx.peminjaman_dan_Pengembalian.create({
        data: {
          nisSiswa,
          idSiswa,
          namaBuku,
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

export const getAllPeminjamanPengembalian = async ({
  nis = "",
  status = "",
  namaBuku = "",
  page = 1,
  pageSize = 10,
}) => {
  try {
    const skip = (page - 1) * pageSize;

    const where = {
      AND: [
        nis ? { Siswa: { nis: { contains: nis, mode: "insensitive" } } } : {},
        status ? { status: { equals: status } } : {},
        namaBuku
          ? { Buku: { nama: { contains: namaBuku, mode: "insensitive" } } }
          : {},
      ],
    };

    const [data, total] = await Promise.all([
      prisma.peminjaman_dan_Pengembalian.findMany({
        where,
        include: {
          Siswa: true,
          Buku_Perpustakaan: true,
        },
        skip,
        take: pageSize,
      }),
      prisma.peminjaman_dan_Pengembalian.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
