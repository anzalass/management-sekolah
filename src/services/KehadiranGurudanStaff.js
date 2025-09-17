import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { hitungJarak } from "../utils/hitungJarak.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

const LAT_SEKOLAH = -6.09955851839959;
const LNG_SEKOLAH = 106.51911493230111;
const MAX_RADIUS = 100; // meter

export const absenMasukGuru = async ({ idGuru, fotoMasuk, lokasi }) => {
  try {
    const { lat, long } = lokasi;
    console.log("idgr", idGuru);

    const guru = await prisma.guru.findUnique({ where: { id: idGuru } });
    if (!guru) {
      throw new Error("Guru tidak ditemukan di database");
    }

    const jarak = hitungJarak(lat, long, LAT_SEKOLAH, LNG_SEKOLAH);
    if (jarak > MAX_RADIUS) {
      throw new Error(
        `Lokasi terlalu jauh dari sekolah: ${Math.round(jarak)} meter`
      );
    }

    let imageUploadResult = null;

    if (fotoMasuk && fotoMasuk.buffer) {
      imageUploadResult = await uploadToCloudinary(
        fotoMasuk.buffer,
        "presensiguru",
        idGuru
      );
    }

    const now = new Date();
    const tanggalHariIni = new Date();
    tanggalHariIni.setHours(0, 0, 0, 0);

    const sudahAbsen = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru,
        tanggal: { gte: tanggalHariIni },
      },
    });

    if (sudahAbsen?.jamMasuk && sudahAbsen?.jamPulang) {
      throw new Error("Anda sudah absen masuk dan pulang hari ini");
    }

    if (sudahAbsen?.jamMasuk) {
      throw new Error("Anda sudah melakukan absen masuk hari ini");
    }

    return await prisma.kehadiranGuru.create({
      data: {
        idGuru: idGuru,
        tanggal: new Date(`${now.toISOString().split("T")[0]}T00:00:00Z`), // <-- ini
        jamMasuk: now,
        fotoMasuk: imageUploadResult?.secure_url,
        lokasiMasuk: JSON.stringify(lokasi),
        status: "",
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const absenPulangGuru = async ({ idGuru, lokasi }) => {
  try {
    const { lat, long } = lokasi;

    const jarak = hitungJarak(lat, long, LAT_SEKOLAH, LNG_SEKOLAH);
    if (jarak > MAX_RADIUS) {
      throw new Error(
        `Lokasi terlalu jauh dari sekolah: ${Math.round(jarak)} meter`
      );
    }

    const now = new Date();
    const tanggalHariIni = new Date();
    tanggalHariIni.setHours(0, 0, 0, 0);

    const absenHariIni = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru,
        tanggal: { gte: tanggalHariIni },
      },
    });

    if (!absenHariIni) {
      throw new Error("Anda belum melakukan absen masuk hari ini");
    }

    if (absenHariIni.jamPulang) {
      throw new Error("Anda sudah melakukan absen pulang hari ini");
    }

    return await prisma.kehadiranGuru.update({
      where: { id: absenHariIni.id },
      data: {
        jamPulang: now,
        lokasiPulang: JSON.stringify(lokasi),
        status: "hadir",
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllKehadiranGuru = async ({
  tanggal,
  nama,
  nip,
  page = 1,
  pageSize = 10,
}) => {
  const tanggalFilter = tanggal ? new Date(`${tanggal}T00:00:00Z`) : undefined;

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
    ...(tanggalFilter && { tanggal: tanggalFilter }),
    ...(nipList && { Guru: { nip: { in: nipList } } }),
  };

  // Hitung total dulu
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

  // Map hasil dan return data + total
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

export const getKehadiranGuruByIdGuru = async (idGuru) => {
  try {
    const data = await prisma.kehadiranGuru.findMany({
      where: {
        idGuru,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
