import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { hitungJarak } from "../utils/hitungJarak.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

const LAT_SEKOLAH = -6.09955851839959;
const LNG_SEKOLAH = 106.51911493230111;
const MAX_RADIUS = 100; // meter

export const absenMasukGuru = async ({ nipGuru, fotoMasuk, lokasi }) => {
  const { lat, long } = lokasi;

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
      nipGuru
    );
  }

  const now = new Date();
  const tanggalHariIni = new Date();
  tanggalHariIni.setHours(0, 0, 0, 0);

  const sudahAbsen = await prisma.kehadiranGuru.findFirst({
    where: {
      nipGuru,
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
      nipGuru,
      tanggal: new Date(`${now.toISOString().split("T")[0]}T00:00:00Z`), // <-- ini
      jamMasuk: now,
      fotoMasuk: imageUploadResult?.secure_url,
      lokasiMasuk: JSON.stringify(lokasi),
      status: "",
    },
  });
};

export const absenPulangGuru = async ({ nipGuru, lokasi }) => {
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
      nipGuru,
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
};

export const getAllKehadiranGuru = async ({
  tanggal,
  nama,
  nip,
  page = 1,
  pageSize = 10,
}) => {
  // Tentukan tanggal filter
  const tanggalFilter = tanggal ? new Date(`${tanggal}T00:00:00Z`) : undefined;

  // Step 1: Cari semua nip guru yang cocok (kalau ada filter nama atau nip)
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

    // Kalau hasil pencarian kosong, langsung balikin array kosong
    if (nipList.length === 0) {
      return [];
    }
  }

  const whereClause = {
    ...(tanggalFilter && { tanggal: tanggalFilter }),
    ...(nipList && { nipGuru: { in: nipList } }),
  };

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

  // Flatten
  return kehadiran.map((item) => ({
    ...item,
    nama: item.Guru?.nama || null,
    nip: item.Guru?.nip || null,
    Guru: undefined,
  }));
};
