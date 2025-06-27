import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

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
