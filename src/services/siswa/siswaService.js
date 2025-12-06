import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const getPembayaranRiwayatPembayaranByIdSiswa = async (idSiswa) => {
  try {
    const tagihan = await prisma.tagihan.findMany({
      where: { idSiswa },
      orderBy: { waktu: "desc" }, // urut waktu
    });

    const riwayatPembayaran = await prisma.riwayatPembayaran.findMany({
      where: { idSiswa },
      orderBy: { waktuBayar: "desc" }, // urut waktu
      include: {
        Tagihan: {
          select: {
            nama: true,
            nominal: true,
            status: true,
          },
        },
      },
    });

    // biar FE gampang pakai, mapping ke field datar
    const riwayatDenganTagihan = riwayatPembayaran.map((r) => ({
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
      status: r.status,
    }));

    return {
      tagihan,
      riwayatPembayaran: riwayatDenganTagihan,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKelasByIdSiswa = async (idSiswa) => {
  try {
    const kelassiswa = await prisma.daftarSiswaKelas.findMany({
      where: { idSiswa },
      include: { Kelas: true }, // langsung join tabel kelas
    });

    return kelassiswa.map((item) => item.Kelas);
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKelasMapelByIdSiswa = async (idSiswa) => {
  try {
    const kelasMapel = await prisma.daftarSiswaMapel.findMany({
      where: {
        idSiswa,
      },
      distinct: ["idKelas"], // ✅ biar ga dobel kelas
      include: {
        KelasDanMapel: {
          include: {
            _count: {
              select: { DaftarSiswa: true },
            },
          },
        },
      },
    });

    return kelasMapel.map((item) => ({
      ...item.KelasDanMapel,
      totalSiswa: item.KelasDanMapel._count.DaftarSiswa,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKelasMapelByIdSiswaRecent = async (idSiswa) => {
  try {
    const sekolah = await prisma.sekolah.findFirst(); // ambil tahun ajaran aktif

    const kelasMapel = await prisma.daftarSiswaMapel.findMany({
      where: {
        idSiswa,
        KelasDanMapel: {
          tahunAjaran: sekolah?.tahunAjaran,
        },
      },
      distinct: ["idKelas"], // ✅ biar ga dobel kelas
      include: {
        KelasDanMapel: {
          include: {
            _count: {
              select: { DaftarSiswa: true },
            },
          },
        },
      },
    });

    return kelasMapel.map((item) => ({
      ...item.KelasDanMapel,
      totalSiswa: item.KelasDanMapel._count.DaftarSiswa,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPresensiByIdSiswa = async (idSiswa) => {
  try {
    const kehadiranSiswa = await prisma.kehadiranSiswa.findMany({
      where: {
        idSiswa,
      },
    });
    return kehadiranSiswa;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPerizinanByIdSiswa = async () => {
  try {
    const perizinanSiswa = await prisma.perizinanSiswa.findMany({
      where: {
        idSiswa,
      },
      orderBy: {
        time: "asc",
      },
    });
    return perizinanSiswa;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumuman = async (idSiswa) => {
  try {
    const now = new Date();

    // Ambil kelas yang diikuti siswa
    const kelassiswa = await prisma.daftarSiswaKelas.findMany({
      where: { idSiswa },
    });
    const kelassiswaMapel = await prisma.daftarSiswaMapel.findMany({
      where: { idSiswa },
    });

    // Ambil semua pengumuman kelas berdasarkan daftar kelas siswa (yg belum lewat)
    let pengumumanKelas = [];

    for (let i = 0; i < kelassiswa.length; i++) {
      const dataPengumumanKelas = await prisma.pengumumanKelas.findMany({
        where: {
          idKelas: kelassiswa[i].idKelas,
          time: { gte: now }, // ← hanya yg belum lewat
        },
        orderBy: { time: "desc" },
      });
      pengumumanKelas = [...pengumumanKelas, ...dataPengumumanKelas];
    }

    for (let i = 0; i < kelassiswaMapel.length; i++) {
      const dataPengumumanKelas = await prisma.pengumumanKelas.findMany({
        where: {
          idKelas: kelassiswaMapel[i].idKelas,
          time: { gte: now }, // ← hanya yg belum lewat
        },
        orderBy: { time: "desc" },
      });
      pengumumanKelas = [...pengumumanKelas, ...dataPengumumanKelas];
    }

    // Ambil pengumuman umum yang belum lewat
    const pengumumanUmum = await prisma.pengumuman.findMany({
      where: { time: { gte: now } }, // ← hanya yg belum lewat
      orderBy: { time: "desc" },
    });

    // Gabung & urutkan berdasarkan time (descending)
    const semuaPengumuman = [...pengumumanUmum, ...pengumumanKelas].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return semuaPengumuman;
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};
export const getRapotSiswa = async (idSiswa) => {
  const rapot = await prisma.daftarSiswaKelas.findMany({
    where: { idSiswa },
    distinct: ["idKelas"], // biar ga dobel kelas
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

  // mapping supaya hasilnya flat, tanpa nested object
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
  const pelanggaran = await prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
    where: {
      idSiswa,
      jenis: "Pelanggaran",
    },
  });

  return pelanggaran;
};

export const getPrestasiSiswa = async (idSiswa) => {
  const pelanggaran = await prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
    where: {
      idSiswa,
      jenis: "Prestasi",
    },
  });

  return pelanggaran;
};

export const getNilaiSiswaByTahun = async (idSiswa) => {
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();

    const nilai = await prisma.nilaiSiswa.findMany({
      where: {
        idSiswa,
        KelasDanMapel: {
          tahunAjaran: tahunAjaran.tahunAjaran, // filter kelas mapel tahun ajaran
        },
      },
      include: {
        JenisNilai: true, // untuk lihat bobot & jenis
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
        KelasDanMapel: {
          namaMapel: "asc",
        },
      },
      // distinct: ["id"],
    });

    // mapping biar rapih
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
  const perpustakaan = await prisma.buku_Perpustakaan.findMany({});
  return perpustakaan;
};
