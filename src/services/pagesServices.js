import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export const dashboardMengajarServicePage = async (idGuru) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Ambil tahun ajaran aktif
    const sekolah = await prisma.sekolah.findFirst({
      select: { tahunAjaran: true },
    });
    const tahunAjaranAktif = sekolah?.tahunAjaran || "";

    // 1. Absensi guru hari ini
    const kehadiranHariIni = await prisma.kehadiranGuru.findFirst({
      where: {
        idGuru,
        tanggal: { gte: todayStart },
      },
    });

    // 2. Kelas yang diwali
    const kelasWaliKelas = await prisma.kelas.findMany({
      where: { idGuru },
      select: {
        id: true,
        nama: true,
        ruangKelas: true,
        tahunAjaran: true,
        banner: true,
        _count: {
          select: { DaftarSiswaKelas: true },
        },
      },
    });

    // 3. Kehadiran siswa per kelas hari ini
    const kehadiranHariIniSiswa = await prisma.kehadiranSiswa.groupBy({
      by: ["idKelas", "keterangan"],
      where: {
        idKelas: { in: kelasWaliKelas.map((k) => k.id) },
        waktu: { gte: todayStart, lte: todayEnd },
      },
      _count: { id: true },
    });

    // 4. Format kehadiran per kelas
    const kehadiranByKelas = new Map();
    kelasWaliKelas.forEach((kelas) => {
      kehadiranByKelas.set(kelas.id, {
        Hadir: 0,
        Izin: 0,
        Sakit: 0,
        TanpaKeterangan: 0,
      });
    });

    kehadiranHariIniSiswa.forEach((item) => {
      const current = kehadiranByKelas.get(item.idKelas);
      if (current) {
        current[item.keterangan] = item._count.id;
      }
    });

    const kelasWaliKelasKehadiran = kelasWaliKelas.map((kelas) => ({
      ...kelas,
      kehadiran: kehadiranByKelas.get(kelas.id) || {
        Hadir: 0,
        Izin: 0,
        Sakit: 0,
        TanpaKeterangan: 0,
      },
    }));

    // 5. Kelas & Mapel yang diajar (pastikan model punya idGuru)
    const kelasMapel = await prisma.kelasDanMapel.findMany({
      where: { idGuru },
      select: {
        id: true,
        namaMapel: true,
        kelas: true,
        banner: true,
        ruangKelas: true,
        tahunAjaran: true,
        _count: {
          select: {
            MateriMapel: true,
            TugasMapel: true,
            UjianIframe: true,
            DaftarSiswa: true,
          },
        },
      },
    });

    const kelasMapelList = await prisma.kelasDanMapel.findMany({
      where: { idGuru },
      select: {
        _count: {
          select: {
            DaftarSiswa: true,
          },
        },
      },
    });

    const totalSiswaMapel = kelasMapelList.reduce(
      (sum, kelas) => sum + kelas._count.DaftarSiswa,
      0
    );

    const kelasList = await prisma.kelas.findMany({
      where: { idGuru },
      select: {
        _count: {
          select: {
            DaftarSiswaKelas: true,
          },
        },
      },
    });

    const totalSiswaKelas = kelasList.reduce(
      (sum, kelas) => sum + kelas._count.DaftarSiswaKelas,
      0
    );

    // 6. Status absen & izin
    const statusMasuk = !!kehadiranHariIni?.jamMasuk;
    const statusKeluar = !!kehadiranHariIni?.jamPulang;

    const izinHariIni = await prisma.perizinanGuru.findFirst({
      where: { idGuru, time: { gte: todayStart } },
    });
    const statusIzin = !!izinHariIni;

    // 7. Data tambahan
    // Dapatkan rentang bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [jadwalGuru, perizinan] = await Promise.all([
      prisma.jadwalMengajar.findMany({
        where: { idGuru, tahunAjaran: tahunAjaranAktif },
      }),
      prisma.perizinanGuru.findMany({
        where: {
          idGuru,
          time: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    // 8. Hitung total murid dari semua kelas yang diwali
    const totalMurid = kelasMapel.reduce(
      (sum, kelas) => sum + (kelas._count.DaftarSiswa || 0),
      0
    );

    // 9. Summary Singkat
    const SummarySingkat = {
      kelasDiajar: kelasMapel.length,
      kelasDiwali: kelasWaliKelas.length,
      totalMurid: totalSiswaKelas + totalSiswaMapel,
      totalJadwal: jadwalGuru.length, // atau count by tahun ajaran jika perlu
      izinBulanIni: perizinan.length, // atau filter by bulan jika perlu
      janjiTemu: await prisma.janjiTemu.count({ where: { idGuru } }),
    };

    // ✅ Return lengkap
    return {
      statusMasuk,
      statusKeluar,
      statusIzin,
      jadwalGuru,
      kelasMapel,
      kelasWaliKelasKehadiran,
      SummarySingkat,
    };
  } catch (error) {
    console.error("Error in dashboardMengajarServicePage:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const dashboardOverview = async () => {
  try {
    const today = new Date();

    // === Sekolah ===
    const anggaranSekolah = await prisma.sekolah.findFirst({
      select: {
        kas: true,
      },
    });

    // === Siswa ===
    const siswaLakilaki = await prisma.siswa.count({
      where: { jenisKelamin: "Laki-laki" },
    });

    const siswaPerempuan = await prisma.siswa.count({
      where: { jenisKelamin: "Perempuan" },
    });

    // === Guru & Fasilitas ===
    const guruStaff = await prisma.guru.count();
    const ruangan = await prisma.ruangan.count();
    const inventaris = await prisma.inventaris.count();

    // === Izin Hari Ini ===
    const izinHariIni = await prisma.perizinanGuru.findMany({
      where: {
        time: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      select: {
        Guru: {
          select: {
            nama: true,
            nip: true,
            foto: true,
          },
        },
        id: true,
        keterangan: true,
        status: true,
        time: true,
        bukti: true,
      },
    });

    // === Guru Masuk Tercepat Hari Ini ===
    const guruMasukTercepat = await prisma.kehadiranGuru.findMany({
      where: {
        tanggal: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        jamMasuk: {
          not: null,
        },
        fotoMasuk: {
          not: "izin",
        },
      },
      orderBy: {
        jamMasuk: "asc",
      },
      select: {
        jamMasuk: true,
        Guru: {
          select: {
            nama: true,
            nip: true,
            foto: true,
          },
        },
      },
      take: 5,
    });

    const riwayatAnggaranHariIni = await prisma.riwayatAnggaran.findMany({
      where: {
        tanggal: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    const pendaftarHariIni = await prisma.pendaftaranSiswa.findMany({
      where: {
        createdOn: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    const totalTagihan = await prisma.tagihan.count({});
    const totalTagihanBelumBayar = await prisma.tagihan.count({
      where: {
        status: "BELUM_BAYAR",
      },
      _sum: {
        nominal: true,
        denda:true
      },
    });

    const totalTagihanMenungguKonfirmasi = await prisma.tagihan.count({
      where: {
        status: "MENUNGGU_KONFIRMASI",
      },
    });
    const result = await prisma.tagihan.aggregate({
      where: {
        status: "BELUM_BAYAR", // ← sesuaikan dengan field & nilai status kamu
      },
      _sum: {
        nominal: true,
        denda: true
      },
    });

    const totalNominalBelumBayar = (result._sum.nominal + result._sum.denda )|| 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Awal bulan
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // Akhir bulan

    const pendaftarBulanIni = await prisma.pendaftaranSiswa.count({
      where: {
        createdOn: {
          gte: startOfMonth, // >= awal bulan
          lte: endOfMonth, // <= akhir bulan
        },
      },
    });

    console.log("pendaftarBulanIni : ",pendaftarBulanIni);

    // === Return Object untuk Frontend ===
    return {
      kasSekolah: anggaranSekolah?.kas || 0,
      jumlahSiswa: {
        lakiLaki: siswaLakilaki,
        perempuan: siswaPerempuan,
        total: siswaLakilaki + siswaPerempuan,
      },
      totalGuru: guruStaff,
      totalRuangan: ruangan,
      totalInventaris: inventaris,
      izinGuruHariIni: izinHariIni,
      guruMasukPalingPagi: guruMasukTercepat,
      pendaftarHariIni,
      riwayatAnggaranHariIni,
      totalTagihan,
      totalNominalBelumBayar: totalNominalBelumBayar,
      pendaftarBulanIni: pendaftarBulanIni,
      totalTagihanMenungguKonfirmasi:totalTagihanMenungguKonfirmasi,
      totalTagihanBelumBayar:totalTagihanBelumBayar,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const dashboardKelasMapel = async (idKelas) => {
  try {
    const [siswaKelas, materiKelas, tugasKelas, ujianKelas] = await Promise.all(
      [
        prisma.daftarSiswaMapel.findMany({
          where: { idKelas },
          select: {
            id: true,
            Siswa: {
              select: {
                id: true,
                nama: true,
                nis: true,
              },
            },
          },
        }),
        prisma.materiMapel.findMany({
          where: { idKelasMapel: idKelas },
        }),
        prisma.tugasMapel.findMany({
          where: { idKelasMapel: idKelas },
        }),
        prisma.ujianIframe.findMany({
          where: {
            idKelasMapel: idKelas,
          },
        }),
      ]
    );

    const namaKelas = await prisma.kelasDanMapel.findUnique({
      where: {
        id: idKelas,
      },
      select: {
        namaMapel: true,
        kelas: true,
      },
    });

    return {
      siswaKelas,
      materiKelas,
      tugasKelas,
      ujianKelas,
      namaKelas: namaKelas.namaMapel,
      kelas: namaKelas.kelas,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const dashboardWaliKelas = async (idKelas) => {
  try {
    const namaKelas = await prisma.kelas.findUnique({
      where: {
        id: idKelas,
      },
      select: {
        nama: true,
      },
    });
    const catatan = await prisma.catatanPerkembanganSiswa.findMany({
      where: {
        idKelas: idKelas,
      },
      include: {
        Siswa: {
          select: {
            id: true,
            nama: true,
            nis: true,
          },
        },
      },
    });

    const pengumuman = await prisma.pengumumanKelas.findMany({
      where: {
        idKelas: idKelas,
      },
    });

    const catatanMap = catatan.map((c) => ({
      id: c.id,
      idSiswa: c.Siswa.id,
      nisSiswa: c.Siswa.nis,
      nama: c.Siswa.nama,
      kategori: c.kategori,
      catatan: c.content,
    }));

    return {
      pengumuman,
      catatanMap,
      namaKelas: namaKelas.nama,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSideBarGuru = async (idGuru, jabatan) => {
  try {
    // Ambil data dari DB
    const kelasWaliKelas = await prisma.kelas.findMany({
      where: { idGuru },
      select: {
        id: true,
        nama: true,
        tahunAjaran: true,
      },
    });

    const kelasMapel = await prisma.kelasDanMapel.findMany({
      where: { idGuru },
      select: {
        id: true,
        namaMapel: true,
        tahunAjaran: true,
      },
    });

    // base sidebar
    const data = [
      {
        title: "Dashboard",
        url: "/mengajar",
        icon: "mengajar",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
      },
      {
        title: "Kelas",
        url: "",
        icon: "kelas",
        isActive: false,
        shortcut: ["d", "d"],
        items: kelasWaliKelas.map((k) => ({
          title: `${k.nama} - ${k.tahunAjaran}`,
          url: `/mengajar/walikelas/${k.id}`,
          icon: "userPen",
          shortcut: ["n", "n"],
        })),
      },
      {
        title: "Mata Pelajaran",
        url: "",
        icon: "mapel",
        isActive: false,
        shortcut: ["d", "d"],
        items: kelasMapel.map((km) => ({
          title: `${km.namaMapel} - ${km.tahunAjaran}`,
          url: `/mengajar/kelas-mapel/${km.id}`,
          icon: "userPen",
          shortcut: ["n", "n"],
        })),
      },
      {
        title: "Jadwal Mengajar",
        url: "/mengajar/jadwal-mengajar",
        icon: "jadwalmengajar",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
      },
      {
        title: "Janji Temu",
        url: "/mengajar/janji-temu",
        icon: "janjitemu",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
      },
      {
        title: "Perizinan & Kehadiran",
        url: "/mengajar/perizinan-kehadiran",
        icon: "clipboard",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
      },
    ];

    // kalau jabatannya Kepala Sekolah, tambahin Dashboard Utama di paling atas
    if (jabatan === "Kepala Sekolah") {
      data.unshift({
        title: "Dashboard Utama",
        url: "/dashboard", // misalnya /dashboard
        icon: "home", // bisa disesuaikan dengan icon library
        isActive: false,
        shortcut: ["u", "u"],
        items: [],
      });
    } else if (jabatan === "Guru BK") {
      data.push({
        title: "Data Konseling Siswa",
        url: "", // misalnya /dashboard
        icon: "messagecircleheart", // bisa disesuaikan dengan icon library
        isActive: false,
        shortcut: ["u", "u"],
        items: [
          {
            title: `Data Konseling Siswa`,
            url: `/mengajar/e-konseling/konseling-siswa`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
          {
            title: `Pelanggaran Prestasi`,
            url: `/mengajar/e-konseling/pelanggaran-prestasi`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
        ],
      });
    } else if (jabatan === "Guru Perpus") {
      data.push({
        title: "E - Perpustakaan",
        url: "", // misalnya /dashboard
        icon: "book", // bisa disesuaikan dengan icon library
        isActive: false,
        shortcut: ["u", "u"],
        items: [
          {
            title: `Data Buku`,
            url: `/mengajar/e-perpus/data-buku`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
          {
            title: `Pelanggaran Prestasi`,
            url: `/mengajar/e-perpus/peminjaman-pengembalian`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
        ],
      });
    } else if (jabatan === "Guru TU") {
      data.push({
        title: "E - Pembayaran",
        url: "", // misalnya /dashboard
        icon: "billing", // bisa disesuaikan dengan icon library
        isActive: false,
        shortcut: ["u", "u"],
        items: [
          {
            title: `Daftar Tagihan Siswa`,
            url: `/mengajar/pembayaran/daftar-tagihan`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
          {
            title: `Riwayat Pembayaran Siswa`,
            url: `/mengajar/pembayaran/riwayat-pembayaran`,
            icon: "userPen",
            shortcut: ["n", "n"],
          },
        ],
      });
    }

    return data;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
