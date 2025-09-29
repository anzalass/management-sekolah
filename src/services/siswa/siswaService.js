import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

export const getPembayaranRiwayatPembayaranByIdSiswa = async (idSiswa) => {
  try {
    const tagihan = await prisma.tagihan.findMany({
      where: { idSiswa },
      orderBy: { waktu: "desc" },
    });

    const riwayatPembayaran = await prisma.riwayatPembayaran.findMany({
      where: { idSiswa },
      orderBy: { waktuBayar: "desc" },
      include: {
        Tagihan: {
          select: {
            nama: true,
            nominal: true,
          },
        },
      },
    });

    return {
      tagihan,
      riwayatPembayaran: riwayatPembayaran.map((r) => ({
        id: r.id,
        namaSiswa: r.namaSiswa,
        nisSiswa: r.nisSiswa,
        idSiswa: r.idSiswa,
        idTagihan: r.idTagihan,
        waktuBayar: r.waktuBayar,
        status: r.status,
        metodeBayar: r.metodeBayar,
        namaTagihan: r.Tagihan?.nama || null,
        nominal: r.Tagihan?.nominal || 0,
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getKelasByIdSiswa = async (idSiswa) => {
  try {
    const kelassiswa = await prisma.daftarSiswaKelas.findMany({
      where: { idSiswa },
      include: { Kelas: true },
    });
    return kelassiswa.map((item) => item.Kelas);
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getKelasMapelByIdSiswa = async (idSiswa) => {
  try {
    const daftar = await prisma.daftarSiswaMapel.findMany({
      where: { idSiswa },
      select: { idKelas: true },
    });
    const idKelasUnique = [...new Set(daftar.map((d) => d.idKelas))];

    const kelasMapel = await prisma.kelasDanMapel.findMany({
      where: { id: { in: idKelasUnique } },
      include: {
        _count: { select: { DaftarSiswa: true } },
      },
    });

    return kelasMapel.map((kelas) => ({
      ...kelas,
      totalSiswa: kelas._count.DaftarSiswa,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getKelasMapelByIdSiswaRecent = async (idSiswa) => {
  try {
    const sekolah = await prisma.sekolah.findFirst();
    const daftar = await prisma.daftarSiswaMapel.findMany({
      where: {
        idSiswa,
        KelasDanMapel: { tahunAjaran: sekolah?.tahunAjaran },
      },
      select: { idKelas: true },
    });
    const idKelasUnique = [...new Set(daftar.map((d) => d.idKelas))];

    const kelasMapel = await prisma.kelasDanMapel.findMany({
      where: {
        id: { in: idKelasUnique },
        tahunAjaran: sekolah?.tahunAjaran,
      },
      include: {
        _count: { select: { DaftarSiswa: true } },
      },
    });

    return kelasMapel.map((kelas) => ({
      ...kelas,
      totalSiswa: kelas._count.DaftarSiswa,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPresensiByIdSiswa = async (idSiswa) => {
  try {
    return await prisma.kehadiranSiswa.findMany({
      where: { idSiswa },
    });
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

// 🔥 FIX: harus ada param idSiswa
export const getPerizinanByIdSiswa = async (idSiswa) => {
  try {
    return await prisma.perizinanSiswa.findMany({
      where: { idSiswa },
      orderBy: { time: "desc" },
    });
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getPengumuman = async (idSiswa) => {
  try {
    const kelassiswa = await prisma.daftarSiswaKelas.findMany({
      where: { idSiswa },
      select: { idKelas: true },
    });

    const idKelasList = kelassiswa.map((k) => k.idKelas);

    const pengumumanKelas = await prisma.pengumumanKelas.findMany({
      where: { idKelas: { in: idKelasList } },
      orderBy: { time: "desc" },
    });

    const pengumumanUmum = await prisma.pengumuman.findMany({
      orderBy: { time: "desc" },
    });

    return [...pengumumanUmum, ...pengumumanKelas].sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getRapotSiswa = async (idSiswa) => {
  const rapot = await prisma.daftarSiswaKelas.findMany({
    where: { idSiswa },
    distinct: ["idKelas"],
    include: {
      Kelas: {
        select: {
          nama: true,
          tahunAjaran: true,
          namaGuru: true,
        },
      },
    },
  });

  return rapot.map((item) => ({
    id: item.id,
    idKelas: item.idKelas,
    idSiswa: item.idSiswa,
    namaSiswa: item.namaSiswa,
    namaGuru: item.Kelas?.namaGuru,
    nisSiswa: item.nisSiswa,
    rapotSiswa: item.rapotSiswa,
    namaKelas: item.Kelas?.nama || null,
    tahunAjaran: item.Kelas?.tahunAjaran || null,
  }));
};

export const getPelanggaranSiswa = async (idSiswa) => {
  return prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
    where: {
      idSiswa,
      jenis: "Pelanggaran",
    },
  });
};

export const getPrestasiSiswa = async (idSiswa) => {
  return prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
    where: {
      idSiswa,
      jenis: "Prestasi",
    },
  });
};

export const getNilaiSiswaByTahun = async (idSiswa) => {
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();

    const nilai = await prisma.nilaiSiswa.findMany({
      where: {
        idSiswa,
        KelasDanMapel: {
          tahunAjaran: tahunAjaran.tahunAjaran,
        },
      },
      include: {
        JenisNilai: true,
        KelasDanMapel: {
          select: {
            id: true,
            namaMapel: true,
            namaGuru: true,
            kelas: true,
            tahunAjaran: true,
          },
        },
      },
      orderBy: {
        KelasDanMapel: { namaMapel: "asc" },
      },
    });

    return nilai.map((n) => ({
      id: n.id,
      nilai: n.nilai,
      jenisNilai: n.JenisNilai.jenis,
      bobot: n.JenisNilai.bobot,
      mapel: n.KelasDanMapel.namaMapel,
      guru: n.KelasDanMapel.namaGuru,
      kelas: n.KelasDanMapel.kelas,
      tahunAjaran: n.KelasDanMapel.tahunAjaran,
      createdAt: n.createdAt,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data nilai siswa");
  }
};

export const getPerpustakaan = async () => {
  return prisma.buku_Perpustakaan.findMany();
};
