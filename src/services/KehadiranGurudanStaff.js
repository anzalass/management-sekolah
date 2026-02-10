import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { hitungJarak } from "../utils/hitungJarak.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
import dotenv from "dotenv";
const prisma = new PrismaClient();

// const LAT_SEKOLAH = -6.09955851839959;
// const LNG_SEKOLAH = 106.51911493230111;
// const MAX_RADIUS = 100; // meter

// LAT_SEKOLAH = "-6.1810233";
// LANG_SEKOLAH = "106.4958147";

dotenv.config();

const getTodayRangeWIB = () => {
  const nowWIB = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  const startOfDay = new Date(nowWIB);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(nowWIB);
  endOfDay.setHours(23, 59, 59, 999);

  return { nowWIB, startOfDay, endOfDay };
};

export const absenMasukGuru = async ({ idGuru, fotoMasuk, lokasi }) => {
  try {
    const { lat, long } = lokasi;

    const guru = await prisma.guru.findUnique({
      where: { id: idGuru },
    });

    if (!guru) {
      throw new Error("Guru tidak ditemukan di database");
    }

    // ===============================
    // 1️⃣ CEK JARAK
    // ===============================
    const jarak = hitungJarak(
      lat,
      long,
      Number(process.env.LAT_SEKOLAH),
      Number(process.env.LANG_SEKOLAH)
    );

    if (jarak > Number(process.env.MAX_RADIUS)) {
      throw new Error(
        `Lokasi terlalu jauh dari sekolah (${Math.round(jarak)} m)`
      );
    }

    // ===============================
    // 2️⃣ WAKTU WIB
    // ===============================
    const { nowWIB, startOfDay, endOfDay } = getTodayRangeWIB();

    // ===============================
    // 3️⃣ CEK SUDAH ABSEN?
    // ===============================
    const sudahAbsen = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru,
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (sudahAbsen?.jamMasuk && sudahAbsen?.jamPulang) {
      throw new Error("Anda sudah absen masuk dan pulang hari ini");
    }

    if (sudahAbsen?.jamMasuk) {
      throw new Error("Anda sudah melakukan absen masuk hari ini");
    }

    // ===============================
    // 4️⃣ UPLOAD FOTO
    // ===============================
    let imageUploadResult = null;

    if (fotoMasuk?.buffer) {
      imageUploadResult = await uploadToCloudinary(
        fotoMasuk.buffer,
        "presensiguru",
        idGuru
      );
    }

    // ===============================
    // 5️⃣ SIMPAN ABSEN MASUK
    // ===============================
    return await prisma.kehadiranGuru.create({
      data: {
        idGuru,
        tanggal: startOfDay, // START OF DAY WIB
        jamMasuk: nowWIB,
        fotoMasuk: imageUploadResult?.secure_url ?? "",
        lokasiMasuk: JSON.stringify(lokasi),
        status: "",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};
export const absenPulangGuru = async ({ idGuru, lokasi }) => {
  try {
    const { lat, long } = lokasi;

    // ===============================
    // 1️⃣ CEK JARAK
    // ===============================
    const jarak = hitungJarak(
      lat,
      long,
      Number(process.env.LAT_SEKOLAH),
      Number(process.env.LANG_SEKOLAH)
    );

    if (jarak > Number(process.env.MAX_RADIUS)) {
      throw new Error(
        `Lokasi terlalu jauh dari sekolah (${Math.round(jarak)} m)`
      );
    }

    // ===============================
    // 2️⃣ WAKTU WIB
    // ===============================
    const { nowWIB, startOfDay, endOfDay } = getTodayRangeWIB();

    // ===============================
    // 3️⃣ AMBIL ABSEN HARI INI
    // ===============================
    const absenHariIni = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru,
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (!absenHariIni) {
      throw new Error("Anda belum melakukan absen masuk hari ini");
    }

    if (absenHariIni.jamPulang) {
      throw new Error("Anda sudah melakukan absen pulang hari ini");
    }

    // ===============================
    // 4️⃣ UPDATE ABSEN PULANG
    // ===============================
    return await prisma.kehadiranGuru.update({
      where: { id: absenHariIni.id },
      data: {
        jamPulang: nowWIB,
        lokasiPulang: JSON.stringify(lokasi),
        status: "Hadir",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getAllKehadiranGuru = async ({
  startDate,
  endDate,
  nama,
  nip,
  page = 1,
  pageSize = 10,
}) => {
  let startDateFilter;
  let endDateFilter;

  if (startDate) {
    startDateFilter = new Date(`${startDate}T00:00:00.000Z`);
  }

  if (endDate) {
    endDateFilter = new Date(`${endDate}T23:59:59.999Z`);
  }

  let nipList = undefined;

  if (nama || nip) {
    const guruFilter = {
      ...(nama && {
        nama: {
          contains: nama,
          mode: "insensitive",
        },
      }),
      ...(nip && {
        nip: {
          contains: nip,
          mode: "insensitive",
        },
      }),
    };

    const gurus = await prisma.guru.findMany({
      where: guruFilter,
      select: { nip: true },
    });

    nipList = gurus.map((g) => g.nip);

    if (nipList.length === 0) {
      return { data: [], total: 0 };
    }
  }

  const whereClause = {
    ...(startDateFilter || endDateFilter
      ? {
          tanggal: {
            ...(startDateFilter && { gte: startDateFilter }),
            ...(endDateFilter && { lte: endDateFilter }),
          },
        }
      : {}),
    ...(nipList && { Guru: { nip: { in: nipList } } }),
  };

  // Hitung total
  const total = await prisma.kehadiranGuru.count({
    where: whereClause,
  });

  // Ambil data dengan pagination
  const kehadiran = await prisma.kehadiranGuru.findMany({
    where: whereClause,
    include: {
      Guru: {
        select: {
          nama: true,
          nip: true,
        },
      },
    },
    orderBy: {
      tanggal: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    data: kehadiran.map((item) => ({
      ...item,
      nama: item.Guru?.nama || null,
      nip: item.Guru?.nip || null,
      Guru: undefined,
    })),
    total,
  };
};

export const getKehadiranGuruByIdGuru = async ({
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
      where.tanggal = {};
      if (startDate) {
        where.tanggal.gte = new Date(startDate);
      }
      if (endDate) {
        where.tanggal.lte = new Date(endDate);
      }
    }

    // Ambil data & total
    const [data, total] = await Promise.all([
      prisma.kehadiranGuru.findMany({
        where,
        skip,
        take: size,
        orderBy: { tanggal: "desc" }, // terbaru dulu
      }),
      prisma.kehadiranGuru.count({ where }),
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
