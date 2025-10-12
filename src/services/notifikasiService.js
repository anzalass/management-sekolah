import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createNotifikasi = async ({
  idSiswa = "",
  idKelas = "",
  idGuru = "",
  redirectSiswa = "",
  redirectGuru = "",
  idTerkait = "",
  kategori = "",
  keterangan = "",
  createdBy = "",
}) => {
  try {
    await prisma.notifikasi.create({
      data: {
        idSiswa,
        idKelas,
        idGuru,
        redirectGuru,
        redirectSiswa,
        idTerkait,
        kategori,
        keterangan,
        createdBy,
        status: "Belum Terbaca",
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const deleteNotifikasiByIdTerkait = async (idTerkait) => {
  try {
    await prisma.notifikasi.deleteMany({
      where: {
        idTerkait,
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const deleteNotifikasiById = async (id) => {
  try {
    await prisma.notifikasi.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const updateStatusAndDeleteSiswa = async (idSiswa) => {
  try {
    // 1. Update semua notifikasi siswa jadi Terbaca
    await prisma.notifikasi.updateMany({
      where: { idSiswa },
      data: { status: "Terbaca" },
    });

    // 2. Hapus notifikasi yang sudah Terbaca lebih dari 2 minggu
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    await prisma.notifikasi.deleteMany({
      where: {
        idSiswa,
        status: "Terbaca",
        createdAt: {
          lt: twoWeeksAgo, // lebih kecil dari (lebih lama dari 2 minggu)
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw prismaErrorHandler(error);
  }
};

export const updateStatusAndDeleteGuru = async (idGuru) => {
  try {
    // 1. Update semua notifikasi siswa jadi Terbaca
    await prisma.notifikasi.updateMany({
      where: { idGuru },
      data: { status: "Terbaca" },
    });

    // 2. Hapus notifikasi yang sudah Terbaca lebih dari 2 minggu
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    await prisma.notifikasi.deleteMany({
      where: {
        idGuru,
        status: "Terbaca",
        createdAt: {
          lt: twoWeeksAgo, // lebih kecil dari (lebih lama dari 2 minggu)
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw prismaErrorHandler(error);
  }
};

export const getNotifikasiByIDPengguna = async (id) => {
  try {
    console.log(id);

    // 1. Ambil semua idKelas terkait user
    const [idKelasMapelSiswa, idKelasSiswa, kelasMapelGuru, kelasGuru] =
      await Promise.all([
        prisma.daftarSiswaMapel.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.daftarSiswaKelas.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.kelasDanMapel.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
        prisma.kelas.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
      ]);

    // 2. Gabung semua idKelas & buang duplikat
    const idKelasList = [
      ...idKelasMapelSiswa.map((d) => d.idKelas),
      ...idKelasSiswa.map((d) => d.idKelas),
      ...kelasMapelGuru.map((d) => d.idKelas), // sebelumnya salah pake d.id
      ...kelasGuru.map((d) => d.id),
    ].filter(Boolean);

    const uniqueIdKelas = [...new Set(idKelasList)];

    // 3. Query Notifikasi
    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        OR: [
          { idSiswa: id },
          { idGuru: id },
          { idKelas: { in: uniqueIdKelas } },
        ],
        NOT: {
          createdBy: id, // 🚀 filter supaya ga ambil notif yang dibuat user sendiri
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Hapus duplikat berdasarkan `id`
    const uniqueNotif = Array.from(
      new Map(notifikasi.map((n) => [n.id, n])).values()
    );

    console.log("yyl", uniqueNotif.length);

    return {
      uniqueNotif: uniqueNotif || [],
      total: uniqueNotif.length || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data notifikasi");
  }
};

export const getNotifikasiByIDPenggunaTotal = async (id) => {
  try {
    console.log(id);

    // 1. Ambil semua idKelas terkait user
    const [idKelasMapelSiswa, idKelasSiswa, kelasMapelGuru, kelasGuru] =
      await Promise.all([
        prisma.daftarSiswaMapel.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.daftarSiswaKelas.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.kelasDanMapel.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
        prisma.kelas.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
      ]);

    // 2. Gabung semua idKelas & buang duplikat
    const idKelasList = [
      ...idKelasMapelSiswa.map((d) => d.idKelas),
      ...idKelasSiswa.map((d) => d.idKelas),
      ...kelasMapelGuru.map((d) => d.idKelas), // sebelumnya salah pake d.id
      ...kelasGuru.map((d) => d.id),
    ].filter(Boolean);

    const uniqueIdKelas = [...new Set(idKelasList)];

    // 3. Query Notifikasi
    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        status: "Belum Terbaca",
        OR: [
          { idSiswa: id },
          { idGuru: id },
          { idKelas: { in: uniqueIdKelas } },
        ],
        NOT: {
          createdBy: id, // 🚀 filter supaya ga ambil notif yang dibuat user sendiri
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Hapus duplikat berdasarkan `id`
    const uniqueNotif = Array.from(
      new Map(notifikasi.map((n) => [n.id, n])).values()
    );

    console.log("yyl", uniqueNotif.length);

    return {
      uniqueNotif: uniqueNotif || [],
      total: uniqueNotif.length || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data notifikasi");
  }
};
