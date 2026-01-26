import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data, foto) => {
  try {
    const existingGuru = await prisma.guru.findUnique({
      where: { id: data.idGuru },
    });
    if (!existingGuru) {
      throw new Error(`Guru dengan NIP ${data.nip} tidak ditemukan`);
    }
    let imageUploadResult = null;

    if (foto && foto.buffer) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "izinguru",
        data.idGuru
      );
    }

    await prisma.perizinanGuru.create({
      data: {
        idGuru: data.idGuru,
        keterangan: data.keterangan,
        time: new Date(`${data.time}T00:00:00Z`),
        status: "menunggu",
        bukti: imageUploadResult?.secure_url ?? "", // pastikan tetap string
        bukti_id: imageUploadResult?.public_id ?? "",
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateStatusPerizinanGuru = async (id, status) => {
  try {
    // 1. Ambil data perizinan
    const izin = await prisma.perizinanGuru.findUnique({
      where: { id },
      include: { Guru: true }, // opsional, untuk log/error
    });

    if (!izin) {
      throw new Error("Perizinan tidak ditemukan");
    }

    // 2. Jika status "disetujui", cek dan buat kehadiran (jika belum ada hari ini)
    if (status === "disetujui") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Cek apakah guru sudah punya kehadiran hari ini
      const existingKehadiran = await prisma.kehadiranGuru.findFirst({
        where: {
          idGuru: izin.idGuru,
          jamMasuk: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      // Jika belum ada, buat baru
      if (!existingKehadiran) {
        await prisma.kehadiranGuru.create({
          data: {
            idGuru: izin.idGuru,
            jamMasuk: new Date(),
            jamPulang: new Date(), // bisa null jika belum pulang, tapi sesuaikan logika
            lokasiMasuk: status === "disetujui" ? "Izin" : "Alpha",
            lokasiPulang: status === "disetujui" ? "Izin" : "Alpha",
            fotoMasuk: status === "disetujui" ? "Izin" : "Alpha",
            status: status === "disetujui" ? "Izin" : "Alpha",
          },
        });
      }
      // Jika sudah ada, biarkan saja (tidak buat duplikat)
    }

    // 3. Update status perizinan
    return await prisma.perizinanGuru.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error("Error updateStatusPerizinanGuru:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
export const deletePerizinanGuru = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPerizinanGuruById = async (id) => {
  const perizinanGuru = await prisma.perizinanGuru.findUnique({
    where: { id },
  });
  if (!perizinanGuru) {
    throw new Error("Perizinan Guru not found");
  }
  return perizinanGuru;
};

export const getPerizinanGuru = async ({
  nama = "",
  nip = "",
  startDate = "",
  endDate = "",
  page = 1,
  pageSize = 10,
}) => {
  const skip = (page - 1) * pageSize;

  let startDateFilter;
  let endDateFilter;

  if (startDate) {
    startDateFilter = new Date(`${startDate}T00:00:00.000Z`);
  }

  if (endDate) {
    endDateFilter = new Date(`${endDate}T23:59:59.999Z`);
  }

  const where = {
    AND: [
      nip
        ? {
            Guru: {
              nip: {
                contains: nip,
                mode: "insensitive",
              },
            },
          }
        : {},
      nama
        ? {
            Guru: {
              nama: {
                contains: nama,
                mode: "insensitive",
              },
            },
          }
        : {},
      startDateFilter || endDateFilter
        ? {
            time: {
              ...(startDateFilter && { gte: startDateFilter }),
              ...(endDateFilter && { lte: endDateFilter }),
            },
          }
        : {},
    ],
  };

  const [dataRaw, total] = await Promise.all([
    prisma.perizinanGuru.findMany({
      where,
      include: {
        Guru: {
          select: {
            nama: true,
            nip: true,
          },
        },
      },
      orderBy: {
        time: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.perizinanGuru.count({ where }),
  ]);

  const data = dataRaw.map((item) => ({
    ...item,
    nama: item.Guru?.nama || null,
    nip: item.Guru?.nip || null,
    Guru: undefined,
  }));

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getPerizinanGuruByIdGuru = async ({
  idGuru,
  page = 1,
  pageSize = 10,
  startDate,
  endDate,
}) => {
  try {
    // Validasi page & pageSize
    const pageNum = Math.max(1, Number(page) || 1);
    const size = Math.max(1, Math.min(100, Number(pageSize) || 10)); // max 10,000 if needed
    const skip = (pageNum - 1) * size;

    // Bangun kondisi where
    const where = { idGuru };

    if (startDate || endDate) {
      where.time = {};
      if (startDate) {
        where.time.gte = new Date(startDate);
      }
      if (endDate) {
        where.time.lte = new Date(endDate);
      }
    }

    // Ambil data & total
    const [data, total] = await Promise.all([
      prisma.perizinanGuru.findMany({
        where,
        skip,
        take: size,
        orderBy: { time: "desc" }, // terbaru dulu
      }),
      prisma.perizinanGuru.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(total / size),
      },
    };
  } catch (error) {
    console.error("Error in getKehadiranGuruByIdGuru:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// lib/holidays.ts
export const HOLIDAYS = [];

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isHoliday(date) {
  const formatted = date.toISOString().split("T")[0];
  return HOLIDAYS.includes(formatted);
}

export function isWorkingDay(date) {
  return !isWeekend(date) && !isHoliday(date);
}

export async function getRekapHadirBulanan({ nama = "", nip = "" }) {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const gurus = await prisma.guru.findMany({
    select: {
      id: true,
      nama: true,
      nip: true,
      KehadiranGuru: {
        where: {
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          tanggal: true,
          status: true, // Hadir | Izin | Alpha
        },
      },
    },
  });

  // 🔍 FILTER DI LEVEL JS
  const filteredGurus = gurus.filter((guru) => {
    const matchNama = nama
      ? guru.nama.toLowerCase().includes(nama.toLowerCase())
      : true;

    const matchNip = nip
      ? guru.nip.toLowerCase().includes(nip.toLowerCase())
      : true;

    return matchNama && matchNip;
  });

  return filteredGurus.map((guru) => {
    let totalHadirHariNormal = 0;
    let totalHadirHariLembur = 0;
    let totalIzin = 0;
    let totalAlpha = 0;

    guru.KehadiranGuru.forEach((absen) => {
      const isKerja = isWorkingDay(absen.tanggal);

      if (absen.status === "Hadir") {
        if (isKerja) {
          totalHadirHariNormal++;
        } else {
          totalHadirHariLembur++;
        }
      }

      if (absen.status === "Izin" && isKerja) {
        totalIzin++;
      }

      if (absen.status === "Alpha" && isKerja) {
        totalAlpha++;
      }
    });

    return {
      nama: guru.nama,
      nip: guru.nip,
      totalHadirHariNormal,
      totalHadirHariLembur,
      totalIzin,
      totalAlpha,
      seluruhTotalHadir: totalHadirHariNormal + totalHadirHariLembur,
    };
  });
}
