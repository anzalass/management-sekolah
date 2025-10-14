import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
} from "./notifikasiService.js";

export const createJenisNilai = async (data) => {
  console.log("dtt", data);

  try {
    return await prisma.$transaction(async (tx) => {
      // Cek total bobot
      const existingJenis = await tx.jenisNilai.findMany({
        where: { idKelasMapel: data.idKelasMapel },
      });

      const totalBobot =
        existingJenis.reduce((acc, item) => acc + Number(item.bobot), 0) +
        Number(data.bobot);

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
      const newJenis = await tx.jenisNilai.create({
        data: {
          idKelasMapel: data.idKelasMapel,
          jenis: data.jenis,
          bobot: Number(data.bobot),
        },
      });

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

      const kelas = await prisma.kelasDanMapel.findUnique({
        where: {
          id: created.idKelasDanMapel,
        },
        select: {
          namaMapel: true,
          idGuru: true,
          id: true,
        },
      });

      if (created) {
        await createNotifikasi({
          idSiswa: created.idSiswa,
          idTerkait: created.id,
          kategori: "Nilai",
          createdBy: kelas.idGuru,
          idKelas: kelas.id,
          redirectSiswa: "/siswa/nilai",
          keterangan: `Kamu mendapatkan nilai : ${created.nilai} dari mata pelajaran : ${kelas.namaMapel} dari penilaian : ${created.jenisNilai}`,
        });
      }
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

      const kelas = await prisma.kelasDanMapel.findUnique({
        where: {
          id: updated.idKelasDanMapel,
        },
        select: {
          namaMapel: true,
          idGuru: true,
          id: true,
        },
      });

      if (updated) {
        await createNotifikasi({
          idSiswa: updated.idSiswa,
          idTerkait: updated.id,
          kategori: "Nilai",
          createdBy: kelas.idGuru,
          idKelas: kelas.id,
          redirectSiswa: "/siswa/nilai",
          keterangan: `Kamu mendapatkan nilai : ${updated.nilai} dari mata pelajaran : ${kelas.namaMapel} dari penilaian : ${updated.jenisNilai}`,
        });
      }
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
    await deleteNotifikasiByIdTerkait(id);
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
  // 1️⃣ Ambil tahun ajaran dari sekolah
  const sekolah = await prisma.sekolah.findFirst({
    select: { tahunAjaran: true },
  });
  if (!sekolah) throw new Error("Data sekolah tidak ditemukan");

  // 2️⃣ Ambil daftar siswa di kelas ini
  const daftarSiswa = await prisma.daftarSiswaKelas.findMany({
    where: { idKelas },
    include: { Siswa: true },
  });

  const idSiswaList = daftarSiswa.map((d) => d.idSiswa);

  // 3️⃣ Ambil semua kelasMapel di tahun ajaran yang sama
  const kelasMapelList = await prisma.kelasDanMapel.findMany({
    where: { tahunAjaran: sekolah.tahunAjaran },
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

  // 4️⃣ Siapkan struktur rekap
  const rekap = {};
  daftarSiswa.forEach((s) => {
    rekap[s.idSiswa] = {
      idSiswa: s.idSiswa,
      nis: s.Siswa.nis,
      nama: s.Siswa.nama,
      nilai: {},
      totalNilai: 0, // untuk rata-rata semua mapel
      totalMapel: 0,
      rataRata: 0,
    };
  });

  // 5️⃣ Hitung nilai akhir per mapel per siswa (berdasarkan bobot)
  kelasMapelList.forEach((mapel) => {
    idSiswaList.forEach((idSiswa) => {
      let totalNilaiXBobot = 0;
      let totalBobot = 0;

      mapel.JenisNilai.forEach((jn) => {
        const nilaiSiswa = jn.NilaiSiswa.find((ns) => ns.idSiswa === idSiswa);
        if (nilaiSiswa && jn.bobot > 0) {
          totalNilaiXBobot += nilaiSiswa.nilai * jn.bobot;
          totalBobot += jn.bobot;
        }

        // tetap tampilkan semua nilai di tabel
        const key = `${mapel.namaMapel}-${jn.jenis}`;
        rekap[idSiswa].nilai[key] = {
          nilai: nilaiSiswa?.nilai || "-",
          bobot: jn.bobot,
        };
      });

      // hitung nilai akhir mapel (kalau ada bobot valid)
      if (totalBobot > 0) {
        const nilaiAkhir = parseFloat(
          (totalNilaiXBobot / totalBobot).toFixed(2)
        );
        rekap[idSiswa].totalNilai += nilaiAkhir;
        rekap[idSiswa].totalMapel += 1;
      }
    });
  });

  // 6️⃣ Hitung rata-rata akhir tiap siswa
  Object.values(rekap).forEach((r) => {
    r.rataRata =
      r.totalMapel > 0
        ? parseFloat((r.totalNilai / r.totalMapel).toFixed(2))
        : 0;
  });

  // 7️⃣ Urutkan dari rata-rata terbesar ke terkecil
  const sortedData = Object.values(rekap).sort(
    (a, b) => b.rataRata - a.rataRata
  );

  const namaKelas = await prisma.kelas.findUnique({
    where: {
      id: idKelas,
    },
    select: {
      nama: true,
    },
  });

  return { data: sortedData, namaKelas: namaKelas.nama };
};
