import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

export const createJenisNilai = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Cek total bobot
      const existingJenis = await tx.jenisNilai.findMany({
        where: { idKelasMapel: data.idKelasMapel },
      });

      const totalBobot =
        existingJenis.reduce((acc, item) => acc + item.bobot, 0) + data.bobot;

      if (totalBobot > 100) {
        throw new Error(`Total bobot melebihi 100% (current: ${totalBobot}%)`);
      }

      const isDuplicate = existingJenis.some(
        (item) => item.jenis === data.jenis
      );

      if (isDuplicate) {
        throw new Error(`Jenis nilai "${data.jenis}" sudah ada`);
      }
      // Buat jenis nilai baru
      const newJenis = await tx.jenisNilai.create({ data });

      // Ambil semua siswa dari kelas
      const kelas = await tx.kelasDanMapel.findUnique({
        where: { id: data.idKelasMapel },
        include: {
          DaftarSiswa: {
            include: { Siswa: true }, // jika kamu punya relasi ke siswa
          },
        },
      });

      if (!kelas) throw new Error("Kelas tidak ditemukan");

      // Buat array nilai siswa (semua nilai 0)
      const nilaiSiswaData = kelas.DaftarSiswa.map((item) => ({
        idSiswa: item.idSiswa,
        idKelasDanMapel: data.idKelasMapel,
        idJenisNilai: newJenis.id,
        jenisNilai: data.jenis,
        nilai: 0,
        createdAt: new Date(),
      }));

      // Simpan semua nilai siswa
      await tx.nilaiSiswa.createMany({ data: nilaiSiswaData });

      return newJenis;
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateJenisNilai = async (id, data) => {
  const { jenis, bobot } = data;
  try {
    return await prisma.$transaction(async (tx) => {
      // Hapus dulu semua nilai siswa yang terkait dengan jenis nilai ini
      await tx.nilaiSiswa.updateMany({
        where: {
          idJenisNilai: id,
        },
        data: { jenisNilai: jenis },
      });
      // Baru hapus jenis nilainya
      const deleted = await tx.jenisNilai.update({
        where: { id },
        data: {
          jenis,
          bobot,
        },
      });

      return deleted;
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteJenisNilai = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Hapus dulu semua nilai siswa yang terkait dengan jenis nilai ini
      await tx.nilaiSiswa.deleteMany({
        where: { idJenisNilai: id },
      });

      // Baru hapus jenis nilainya
      const deleted = await tx.jenisNilai.delete({
        where: { id },
      });

      return deleted;
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// ✅ Get JenisNilai by idKelasMapel (tanpa transaksi karena read-only)
export const getJenisNilaiByKelasMapel = async (idKelasMapel) => {
  try {
    return await prisma.jenisNilai.findMany({
      where: { idKelasMapel },
      orderBy: { jenis: "asc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const createNilaiSiswa = async (data) => {
  try {
    const jenisNilai = await prisma.jenisNilai.findUnique({
      where: {
        id: data.idJenisNilai,
      },
    });
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.nilaiSiswa.create({
        data: {
          jenisNilai: jenisNilai?.jenis,
          idSiswa: data.idSiswa,
          idKelasDanMapel: data.idKelasDanMapel,
          idJenisNilai: data.idJenisNilai,
          nilai: data.nilai,
          createdAt: new Date(),
        },
      });
      return created;
    });
    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateNilaiSiswa = async (id, data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.nilaiSiswa.update({
        where: { id },
        data: {
          nilai: data.nilai,
          createdAt: new Date(),
        },
      });
      return updated;
    });
    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteNilaiSiswa = async (id) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const deleted = await tx.nilaiSiswa.delete({
        where: { id },
      });
      return deleted;
    });
    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllNilaiSiswaByIdKelas = async (idKelasDanMapel) => {
  try {
    const nilaiSiswa = await prisma.nilaiSiswa.findMany({
      where: { idKelasDanMapel },
      select: {
        id: true,
        idSiswa: true,
        idKelasDanMapel: true,
        idJenisNilai: true,
        jenisNilai: true,
        nilai: true,
        Siswa: {
          select: {
            nama: true,
          },
        },
      },
    });

    // flatten nama dari relasi Siswa ke properti utama
    return nilaiSiswa.map((item) => ({
      id: item.id,
      nisSiswa: item.nisSiswa,
      idKelasDanMapel: item.idKelasDanMapel,
      idJenisNilai: item.idJenisNilai,
      jenisNilai: item.jenisNilai,
      nama: item.Siswa?.nama || null,
      nilai: item.nilai,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getRekapNilaiByKelasMapel = async (idKelasDanMapel) => {
  // 1. Ambil tahun ajaran dari sekolah pertama
  const sekolah = await prisma.sekolah.findFirst({
    select: { tahunAjaran: true },
  });

  if (!sekolah) throw new Error("Data sekolah tidak ditemukan");

  // 2. Ambil semua jenis nilai untuk kelas mapel ini
  const jenisNilai = await prisma.jenisNilai.findMany({
    where: {
      idKelasMapel: idKelasDanMapel,
      KelasDanMapel: { tahunAjaran: sekolah.tahunAjaran },
    },
    orderBy: { jenis: "asc" },
  });

  // 3. Ambil semua nilai siswa
  const nilaiSiswa = await prisma.nilaiSiswa.findMany({
    where: {
      idKelasDanMapel,
      KelasDanMapel: { tahunAjaran: sekolah.tahunAjaran },
    },
    include: {
      Siswa: true,
    },
  });

  // 4. Rekap nilai
  const rekap = {};
  nilaiSiswa.forEach((n) => {
    if (!rekap[n.idSiswa]) {
      rekap[n.idSiswa] = {
        idSiswa: n.idSiswa,
        nis: n.Siswa.nis,
        nama: n.Siswa.nama,
        nilai: {},
        total: 0,
      };
    }
    rekap[n.idSiswa].nilai[n.jenisNilai] = n.nilai;
    rekap[n.idSiswa].total += n.nilai;
  });

  return {
    jenisNilai: jenisNilai.map((j) => j.jenis),
    data: Object.values(rekap),
  };
};

// services/rekapNilaiService.js

export const getRekapNilaiKelasBaru = async (idKelas) => {
  // 1. Ambil tahun ajaran dari sekolah pertama
  const sekolah = await prisma.sekolah.findFirst({
    select: { tahunAjaran: true },
  });
  if (!sekolah) throw new Error("Data sekolah tidak ditemukan");

  // 2. Ambil daftar siswa di kelas ini
  const daftarSiswa = await prisma.daftarSiswaKelas.findMany({
    where: { idKelas },
    include: { Siswa: true },
  });

  const idSiswaList = daftarSiswa.map((d) => d.idSiswa);

  // 3. Ambil semua kelasMapel di tahun ajaran yang sama
  const kelasMapelList = await prisma.kelasDanMapel.findMany({
    where: {
      tahunAjaran: sekolah.tahunAjaran,
    },
    include: {
      JenisNilai: {
        include: {
          NilaiSiswa: {
            where: { idSiswa: { in: idSiswaList } },
            include: { Siswa: true },
          },
        },
      },
    },
  });

  // 4. Bentuk rekap nilai
  const rekap = {};

  daftarSiswa.forEach((s) => {
    rekap[s.idSiswa] = {
      idSiswa: s.idSiswa,
      nis: s.Siswa.nis,
      nama: s.Siswa.nama,
      nilai: {},
      total: 0,
    };
  });

  kelasMapelList.forEach((mapel) => {
    mapel.JenisNilai.forEach((jn) => {
      jn.NilaiSiswa.forEach((ns) => {
        rekap[ns.idSiswa].nilai[`${mapel.namaMapel}-${jn.jenis}`] = ns.nilai;
        rekap[ns.idSiswa].total += ns.nilai;
      });
    });
  });

  return {
    data: Object.values(rekap),
  };
};
