import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data, foto) => {
  try {
    // 1️⃣ CEK GURU
    const existingGuru = await prisma.guru.findUnique({
      where: { id: data.idGuru },
      select: { id: true },
    });

    if (!existingGuru) {
      throw new Error("Guru tidak ditemukan");
    }

    // ===============================
    // 2️⃣ VALIDASI TANGGAL (WIB)
    // ===============================

    // tanggal izin dari FE
    const izinDate = new Date(data.time);

    // hari ini versi WIB
    const nowWIB = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );

    const startOfTodayWIB = new Date(nowWIB);
    startOfTodayWIB.setHours(0, 0, 0, 0);

    if (izinDate < startOfTodayWIB) {
      throw new Error(
        "Tidak boleh mengajukan izin untuk hari yang sudah lewat"
      );
    }

    // ===============================
    // 3️⃣ RANGE HARI INI (WIB)
    // ===============================
    const endOfTodayWIB = new Date(startOfTodayWIB);
    endOfTodayWIB.setHours(23, 59, 59, 999);

    // ===============================
    // 4️⃣ CEK IZIN HARI INI
    // ===============================
    const izinHariIni = await prisma.perizinanGuru.findFirst({
      where: {
        idGuru: data.idGuru,
        time: {
          gte: startOfTodayWIB,
          lte: endOfTodayWIB,
        },
      },
    });

    if (izinHariIni) {
      throw new Error("Anda sudah mengajukan izin hari ini");
    }

    // ===============================
    // 5️⃣ UPLOAD FOTO (OPSIONAL)
    // ===============================
    let imageUploadResult = null;

    if (foto?.buffer) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "izinguru",
        data.idGuru
      );
    }

    // ===============================
    // 6️⃣ SIMPAN IZIN
    // ===============================
    return await prisma.perizinanGuru.create({
      data: {
        idGuru: data.idGuru,
        keterangan: data.keterangan,
        time: izinDate,
        status: "menunggu",
        bukti: imageUploadResult?.secure_url ?? "",
        bukti_id: imageUploadResult?.public_id ?? "",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

const WIB_OFFSET = 7 * 60 * 60 * 1000;

export const nowWIB = () => {
  return new Date(Date.now() + WIB_OFFSET);
};

export const startOfTodayWIB = () => {
  const now = nowWIB();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

export const endOfTodayWIB = () => {
  const now = nowWIB();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
};

// convert date apa pun → WIB
export const toWIB = (date) => {
  return new Date(new Date(date).getTime() + WIB_OFFSET);
};

export const startOfDayWIBFromDate = (date) => {
  const d = toWIB(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
};

export const endOfDayWIBFromDate = (date) => {
  const d = toWIB(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
};

export const updateStatusPerizinanGuru = async (id, status) => {
  try {
    const izin = await prisma.perizinanGuru.findUnique({
      where: { id },
    });

    if (!izin) {
      throw new Error("Perizinan tidak ditemukan");
    }

    // ✅ waktu izin (WIB)
    const izinTimeWIB = toWIB(izin.time);
    const dayStart = startOfDayWIBFromDate(izin.time);
    const dayEnd = endOfDayWIBFromDate(izin.time);

    // 1️⃣ cari kehadiran di tanggal izin
    const existingKehadiran = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru: izin.idGuru,
        tanggal: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    // 2️⃣ mapping status
    let kehadiranStatus = null;
    if (status === "disetujui") kehadiranStatus = "Izin";
    else if (status === "ditolak") kehadiranStatus = "Alpha";
    else if (status === "menunggu") kehadiranStatus = "Menunggu";

    // 3️⃣ sync kehadiran
    if (kehadiranStatus) {
      if (existingKehadiran) {
        await prisma.kehadiranGuru.update({
          where: { id: existingKehadiran.id },
          data: {
            status: kehadiranStatus,
            lokasiMasuk: kehadiranStatus,
            lokasiPulang: kehadiranStatus,
            fotoMasuk: kehadiranStatus,
            jamMasuk: existingKehadiran.jamMasuk ?? izinTimeWIB,
            jamPulang: existingKehadiran.jamPulang ?? izinTimeWIB,
          },
        });
      } else {
        await prisma.kehadiranGuru.create({
          data: {
            idGuru: izin.idGuru,
            tanggal: dayStart,
            jamMasuk: izinTimeWIB,
            jamPulang: izinTimeWIB,
            lokasiMasuk: kehadiranStatus,
            lokasiPulang: kehadiranStatus,
            fotoMasuk: kehadiranStatus,
            status: kehadiranStatus,
          },
        });
      }
    }

    // 4️⃣ update izin
    return await prisma.perizinanGuru.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error("Error updateStatusPerizinanGuru:", error);
    throw new Error(prismaErrorHandler(error));
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

export async function getRekapHadirBulanan({
  nama = "",
  nip = "",
  page = 1,
  limit = 10,
}) {
  // ✅ PAKSA NUMBER
  page = Number(page) || 1;
  limit = Number(limit) || 10;

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

  const whereGuru = {
    ...(nama && {
      nama: { contains: nama, mode: "insensitive" },
    }),
    ...(nip && {
      nip: { contains: nip, mode: "insensitive" },
    }),
  };

  const total = await prisma.guru.count({ where: whereGuru });

  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const gurus = await prisma.guru.findMany({
    where: whereGuru,
    skip,
    take: limit, // ✅ INT
    select: {
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
          status: true,
        },
      },
    },
    orderBy: { nama: "asc" },
  });

  const data = gurus.map((guru) => {
    let totalHadirHariNormal = 0;
    let totalHadirHariLembur = 0;
    let totalIzin = 0;
    let totalAlpha = 0;

    guru.KehadiranGuru.forEach((absen) => {
      const isKerja = isWorkingDay(absen.tanggal);

      if (absen.status === "Hadir") {
        isKerja ? totalHadirHariNormal++ : totalHadirHariLembur++;
      }

      if (absen.status === "Izin" && isKerja) totalIzin++;
      if (absen.status === "Alpha" && isKerja) totalAlpha++;
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

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
