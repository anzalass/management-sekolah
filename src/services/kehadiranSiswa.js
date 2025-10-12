import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

import { addHours } from "date-fns";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
} from "./notifikasiService.js";

export const createKehadiranSiswa = async (data) => {
  try {
    const { idSiswa, idKelas, keterangan, namaSiswa, nisSiswa } = data;

    // Ambil waktu lokal Indonesia (WIB)
    const now = new Date();
    const waktuWIB = addHours(now, 7); // offset server UTC → WIB

    // Batas awal dan akhir hari (WIB)
    const tanggalAwal = new Date(waktuWIB);
    tanggalAwal.setHours(0, 0, 0, 0);

    const tanggalAkhir = new Date(waktuWIB);
    tanggalAkhir.setHours(23, 59, 59, 999);

    // Cek apakah sudah absen hari ini
    const sudahAbsen = await prisma.kehadiranSiswa.findFirst({
      where: {
        idSiswa,
        idKelas,
        waktu: {
          gte: tanggalAwal,
          lte: tanggalAkhir,
        },
      },
    });

    if (sudahAbsen) {
      throw new Error("Siswa sudah melakukan absensi hari ini.");
    }

    // Buat kehadiran baru
    const kehadiran = await prisma.kehadiranSiswa.create({
      data: {
        idSiswa,
        namaSiswa,
        nisSiswa,
        idKelas,
        waktu: new Date(),
        keterangan,
      },
    });

    const kelas = await prisma.kelas.findUnique({
      where: {
        id: idKelas,
      },
      select: {
        idGuru: true,
      },
    });

    if (kehadiran) {
      await createNotifikasi({
        idSiswa: kehadiran.idSiswa,
        idTerkait: kehadiran.id,
        kategori: "Kehadiran Siswa",
        idKelas: idKelas,
        createdBy: kelas.idGuru,
        redirectSiswa: "/siswa/log-presensi",
        keterangan: `Detail kehadiran ${kehadiran.waktu.toLocaleDateString()}`,
      });
    }

    return kehadiran;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const createKehadiranSiswaManual = async (data) => {
  try {
    const { idSiswa, idKelas, waktu, keterangan } = data;

    // Ambil waktu lokal Indonesia (WIB)
    const now = new Date();
    const waktuWIB = addHours(now, 7); // offset server UTC → WIB

    // Batas awal dan akhir hari (WIB)
    const tanggalAwal = new Date(waktuWIB);
    tanggalAwal.setHours(0, 0, 0, 0);

    const tanggalAkhir = new Date(waktuWIB);
    tanggalAkhir.setHours(23, 59, 59, 999);

    // Cek apakah sudah absen hari ini

    const siswa = await prisma.siswa.findUnique({
      where: {
        id: idSiswa,
      },
    });

    // Buat kehadiran baru
    const kehadiran = await prisma.kehadiranSiswa.create({
      data: {
        idSiswa,
        namaSiswa: siswa.nama,
        nisSiswa: siswa.nis,
        idKelas,
        waktu: waktu,
        keterangan: keterangan,
      },
    });

    return kehadiran;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteKehadiranSiswa = async (id) => {
  try {
    const deleted = await prisma.kehadiranSiswa.delete({
      where: { id },
    });
    await deleteNotifikasiByIdTerkait(id);
    return deleted;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSiswaByKelasWithKehadiranHariIni = async (idKelas) => {
  try {
    // Ambil tanggal hari ini di zona Asia/Jakarta
    const now = new Date();
    const todayJakarta = new Date(
      new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    );

    todayJakarta.setHours(0, 0, 0, 0);

    const besokJakarta = new Date(todayJakarta);
    besokJakarta.setDate(todayJakarta.getDate() + 1);

    // Query ke Prisma
    const siswaList = await prisma.siswa.findMany({
      where: {
        DaftarSiswaKelas: {
          some: {
            idKelas,
          },
        },
      },
      select: {
        id: true,
        nis: true,
        nama: true,
        KehadiranSiswa: {
          select: {
            id: true,
            waktu: true,
            keterangan: true,
          },
          where: {
            waktu: {
              gte: todayJakarta,
              lt: besokJakarta,
            },
            idKelas,
          },
        },
      },
    });

    // Map data untuk React Table
    const siswaListWithId = siswaList.map((siswa) => ({
      id: siswa.id,
      nis: siswa.nis,
      nama: siswa.nama,
      kehadiranSiswa: siswa.KehadiranSiswa,
    }));

    return siswaListWithId;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateKeteranganKehadiran = async (id, keterangan) => {
  try {
    const allowedValues = ["Hadir", "Sakit", "Izin", "Tanpa Keterangan"];

    if (!allowedValues.includes(keterangan)) {
      throw new Error("Keterangan hanya boleh: Hadir, Sakit, atau Izin.");
    }

    const updated = await prisma.kehadiranSiswa.update({
      where: { id },
      data: { keterangan },
    });

    await deleteNotifikasiByIdTerkait(id);
    await createNotifikasi({
      createdBy: "",
      idGuru: "",
      idKelas: updated.idKelas,
      idSiswa: updated.idSiswa,
      idTerkait: updated.id,
      kategori: "Kehadiran Siswa",
      redirectSiswa: "/siswa/log-presensi",
      keterangan: `Detail kehadiran : ${updated.waktu.toLocaleDateString()}`,
    });

    return updated;
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAbsensiTableByKelas = async (idKelas) => {
  // 1. Ambil semua data absensi kelas tsb (tanggal unik)
  const allAbsensi = await prisma.kehadiranSiswa.findMany({
    where: { idKelas },
    select: {
      idSiswa: true,
      nisSiswa: true,
      namaSiswa: true,
      keterangan: true,
      waktu: true,
    },
    orderBy: { waktu: "asc" },
  });

  // 2. Ambil daftar siswa unik di kelas tsb
  const siswaUnique = Array.from(
    new Map(
      allAbsensi.map((a) => [
        a.idSiswa || a.nisSiswa,
        { idSiswa: a.idSiswa, nisSiswa: a.nisSiswa, namaSiswa: a.namaSiswa },
      ])
    ).values()
  );

  // 3. Ambil semua tanggal unik (format yyyy-mm-dd)
  const tanggalUnik = Array.from(
    new Set(allAbsensi.map((a) => a.waktu.toISOString().slice(0, 10)))
  ).sort();

  // 4. Buat map data supaya gampang akses status per siswa per tanggal
  const absensiMap = new Map();

  allAbsensi.forEach((a) => {
    const key = `${a.idSiswa || a.nisSiswa}|${a.waktu
      .toISOString()
      .slice(0, 10)}`;
    absensiMap.set(key, a.keterangan);
  });

  // 5. Buat matriks data: tiap siswa + tanggal => status
  const tableData = siswaUnique.map((s) => {
    const row = {
      idSiswa: s.idSiswa,
      nisSiswa: s.nisSiswa,
      namaSiswa: s.namaSiswa,
    };
    tanggalUnik.forEach((tgl) => {
      const key = `${s.idSiswa || s.nisSiswa}|${tgl}`;
      row[tgl] = absensiMap.get(key) || "-"; // misal '-' kalau gak ada absen
    });
    return row;
  });

  return {
    tanggalUnik,
    tableData,
  };
};

export const getRekapAbsensiByKelas = async (idKelas) => {
  // 1. Ambil data absensi
  const absensi = await prisma.kehadiranSiswa.findMany({
    where: { idKelas },
    select: {
      idSiswa: true,
      nisSiswa: true,
      namaSiswa: true,
      keterangan: true, // "Hadir", "Izin", "Sakit", "Alpa" dll.
      waktu: true,
    },
    orderBy: {
      waktu: "asc",
    },
  });

  // 2. Group dan hitung
  const rekap = absensi.reduce((acc, curr) => {
    const key = curr.idSiswa || curr.nisSiswa;

    if (!acc[key]) {
      acc[key] = {
        idSiswa: curr.idSiswa,
        nisSiswa: curr.nisSiswa,
        namaSiswa: curr.namaSiswa,
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
        total: 0,
      };
    }

    acc[key].total += 1;
    const keterangan = curr.keterangan?.toLowerCase() || "";
    if (keterangan === "hadir") acc[key].hadir += 1;
    else if (keterangan === "izin") acc[key].izin += 1;
    else if (keterangan === "sakit") acc[key].sakit += 1;
    else acc[key].alpa += 1;

    return acc;
  }, {});

  // 3. Return dalam bentuk array
  return Object.values(rekap);
};

export const getAbsesniSiswaByKelas = async (idSiswa, idKelas) => {
  try {
    const dataAbsen = await prisma.kehadiranSiswa.findMany({
      where: {
        idKelas,
        idSiswa,
      },
    });

    return dataAbsen;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
