import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export const dashboardMengajarServicePage = async (nipGuru) => {
  try {
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    // Ambil data absensi hari ini
    const kehadiranHariIni = await prisma.kehadiranGuru.findFirst({
      where: {
        nipGuru,
        tanggal: { gte: hariIni },
      },
    });

    // Status absen
    const statusMasuk = !!kehadiranHariIni?.jamMasuk;
    const statusKeluar = !!kehadiranHariIni?.jamPulang;

    // Cek perizinan hari ini
    const izinHariIni = await prisma.perizinanGuru.findFirst({
      where: {
        nipGuru,
        time: { gte: hariIni },
      },
    });

    const statusIzin = !!izinHariIni;

    // Data lainnya
    const [kehadiranGuru, jadwalGuru, kelasWaliKelas, kelasMapel, perizinan] =
      await Promise.all([
        prisma.kehadiranGuru.findMany({ where: { nipGuru } }),
        prisma.jadwalMengajar.findMany({ where: { nipGuru } }),
        prisma.kelas.findMany({ where: { nipGuru } }),
        prisma.kelasDanMapel.findMany({ where: { nipGuru } }),
        prisma.perizinanGuru.findMany({ where: { nipGuru } }),
      ]);

    return {
      statusMasuk,
      statusKeluar,
      statusIzin,
      kehadiranGuru,
      jadwalGuru,
      kelasWaliKelas,
      kelasMapel,
      perizinan,
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const dashboardOverview = async () => {
  try {
    const today = new Date();

    // === Sekolah ===
    const anggaranSekolah = await prisma.sekolah.findFirst({
      select: {
        kas: true,
      },
    });

    // === Siswa ===
    const siswaLakilaki = await prisma.siswa.count({
      where: { jenisKelamin: "Laki-laki" },
    });

    const siswaPerempuan = await prisma.siswa.count({
      where: { jenisKelamin: "Perempuan" },
    });

    // === Guru & Fasilitas ===
    const guruStaff = await prisma.guru.count();
    const ruangan = await prisma.ruangan.count();
    const inventaris = await prisma.inventaris.count();

    // === Izin Hari Ini ===
    const izinHariIni = await prisma.perizinanGuru.findMany({
      where: {
        time: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      select: {
        Guru: {
          select: {
            nama: true,
            nip: true,
            foto: true,
          },
        },
        keterangan: true,
        status: true,
        time: true,
      },
    });

    // === Guru Masuk Tercepat Hari Ini ===
    const guruMasukTercepat = await prisma.kehadiranGuru.findMany({
      where: {
        tanggal: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        jamMasuk: {
          not: null,
        },
      },
      orderBy: {
        jamMasuk: "asc",
      },
      select: {
        jamMasuk: true,
        nipGuru: true,
        Guru: {
          select: {
            nama: true,
            nip: true,
            foto: true,
          },
        },
      },
    });

    // === Return Object untuk Frontend ===
    return {
      kasSekolah: anggaranSekolah?.kas || 0,
      jumlahSiswa: {
        lakiLaki: siswaLakilaki,
        perempuan: siswaPerempuan,
        total: siswaLakilaki + siswaPerempuan,
      },
      totalGuru: guruStaff,
      totalRuangan: ruangan,
      totalInventaris: inventaris,
      izinGuruHariIni: izinHariIni,
      guruMasukPalingPagi: guruMasukTercepat,
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw new Error(prismaErrorHandler(error));
  }
};
