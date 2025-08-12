import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingSekolah = await prisma.sekolah.findFirst({
    where: { npsn: "12345678" },
  });

  if (!existingSekolah) {
    await prisma.sekolah.create({
      data: {
        nama: "SD Negeri 01 Jakarta",
        npsn: "12345678",
        kas: 50000000,
        desa: "Cempaka Baru",
        kecamatan: "Kemayoran",
        kabupaten: "Jakarta Pusat",
        provinsi: "DKI Jakarta",
        telephone: "0211234567",
        email: "sdn01jakarta@example.com",
        website: "https://sdn01jakarta.sch.id",
        namaKepsek: "Ibu Siti Aminah",
        logo: null,
        logoId: null,
        tahunAjaran: "2024-2025",
      },
    });

    console.log("✅ Data sekolah berhasil ditambahkan.");
  } else {
    console.log("⚠️  Sekolah dengan NPSN tersebut sudah ada.");
  }

  const hashedPassword = await bcrypt.hash("gurupassword", 10);

  // ===== Tambah 5 Guru =====
  const guruList = Array.from({ length: 5 }, (_, i) => ({
    nip: `12345678${i}`,
    nik: `987654321${i}`,
    password: hashedPassword,
    jabatan: "Guru",
    nama: `Guru Ke-${i + 1}`,
    tempatLahir: "Jakarta",
    tanggalLahir: new Date(`198${i}-01-01`),
    alamat: `Jl. Pendidikan No.${i + 1}`,
    agama: "Islam",
    jenisKelamin: i % 2 === 0 ? "Laki-laki" : "Perempuan",
    noTelepon: `0812345678${90 + i}`,
    email: `guru${i + 1}@example.com`,
    status: "Aktif",
    foto: null,
    fotoId: null,
  }));

  for (const guru of guruList) {
    const existing = await prisma.guru.findFirst({ where: { nip: guru.nip } });
    if (!existing) {
      await prisma.guru.create({ data: guru });
      console.log(`✅ Guru ${guru.nama} berhasil ditambahkan.`);
    } else {
      console.log(`⚠️  Guru ${guru.nama} sudah ada.`);
    }
  }

  // ===== Tambah 20 Siswa =====
  const siswaList = Array.from({ length: 20 }, (_, i) => ({
    nis: `202400${i + 2}`,
    nik: `32010102030400${i + 2}`.padEnd(16, "0"),
    nama: `Siswa ${i + 1}`,
    jurusan: i % 2 === 0 ? "IPA" : "IPS",
    tanggalLahir: new Date(`2007-08-${(i % 28) + 1}`),
    tempatLahir: "Jakarta",
    namaAyah: `Ayah Siswa ${i + 1}`,
    namaIbu: `Ibu Siswa ${i + 1}`,
    tahunLulus: "2025",
    poin: 100,
    alamat: `Jl. Siswa No.${i + 1}`,
    agama: "Islam",
    kelas: `9${String.fromCharCode(65 + (i % 3))}`, // 9A, 9B, 9C
    jenisKelamin: i % 2 === 0 ? "Laki-laki" : "Perempuan",
    foto: null,
    fotoId: null,
    noTelepon: `081234567${891 + i}`,
    noTeleponOrtu: `0812987654${32 + i}`,
    email: `siswa${i + 1}@example.com`,
    ekstraKulikulerPeminatan: i % 2 === 0 ? "Robotik" : "Seni Tari",
    ekstraKulikulerWajib: "Pramuka",
  }));

  for (const siswa of siswaList) {
    const existing = await prisma.siswa.findFirst({
      where: { nis: siswa.nis },
    });
    if (!existing) {
      await prisma.siswa.create({ data: siswa });
      console.log(`✅ Siswa ${siswa.nama} berhasil ditambahkan.`);
    } else {
      console.log(`⚠️  Siswa ${siswa.nama} sudah ada.`);
    }
  }

  // ===== Tambah Ruangan =====
  const ruanganList = [
    "Ruang Kelas 1",
    "Ruang Kelas 2",
    "Lab IPA",
    "Perpustakaan",
    "Ruang Guru",
  ];

  for (const nama of ruanganList) {
    await prisma.ruangan.upsert({
      where: { nama },
      update: {},
      create: { nama, keterangan: `Ini adalah ${nama.toLowerCase()}` },
    });
    console.log(`✅ Ruangan ${nama} berhasil ditambahkan.`);
  }

  // ===== Tambah Jenis Inventaris =====
  const jenisInventarisList = [
    "Elektronik",
    "Meubel",
    "Buku",
    "Alat Tulis",
    "Olahraga",
  ];

  for (const nama of jenisInventarisList) {
    await prisma.jenis_Inventaris.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
    console.log(`✅ Jenis inventaris ${nama} berhasil ditambahkan.`);
  }

  // ===== Tambah Inventaris =====
  for (let i = 0; i < 7; i++) {
    await prisma.inventaris.create({
      data: {
        nama: `Barang Inventaris ${i + 1}`,
        quantity: 10 + i,
        ruang: ruanganList[i % ruanganList.length],
        hargaBeli: 500000 + i * 10000,
        waktuPengadaan: new Date(`2023-0${(i % 9) + 1}-15`),
        keterangan: `Keterangan untuk barang inventaris ${i + 1}`,
      },
    });
    console.log(`✅ Inventaris ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Riwayat Anggaran =====
  for (let i = 0; i < 6; i++) {
    await prisma.riwayatAnggaran.create({
      data: {
        nama: `Anggaran ${i + 1}`,
        tanggal: new Date(`2024-0${(i % 9) + 1}-10`),
        jumlah: 1000000 + i * 500000,
        jenis: i % 2 === 0 ? "Pemasukan" : "Pengeluaran",
        keterangan: `Keterangan anggaran ke-${i + 1}`,
      },
    });
    console.log(`✅ Riwayat anggaran ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Kegiatan Sekolah =====
  for (let i = 0; i < 5; i++) {
    const start = new Date(`2024-0${i + 1}-05`);
    const end = new Date(start);
    end.setDate(end.getDate() + 2);

    await prisma.kegiatanSekolah.create({
      data: {
        nama: `Kegiatan ${i + 1}`,
        tahunAjaran: "2024-2025",
        keterangan: `Kegiatan ke-${i + 1} untuk siswa`,
        waktuMulai: start,
        waktuSelesai: end,
        status: i % 2 === 0 ? "Berlangsung" : "Selesai",
      },
    });
    console.log(`✅ Kegiatan sekolah ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Pengumuman =====
  for (let i = 0; i < 5; i++) {
    await prisma.pengumuman.create({
      data: {
        title: `Pengumuman ${i + 1}`,
        time: new Date(),
        content: `Isi pengumuman penting nomor ${i + 1}`,
      },
    });
    console.log(`✅ Pengumuman ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Mata Pelajaran =====
  const guruIds = await prisma.guru.findMany({ select: { id: true } });
  for (let i = 0; i < 7; i++) {
    await prisma.mata_Pelajaran.create({
      data: {
        nama: `Pelajaran ${i + 1}`,
        kelas: `Kelas ${(i % 6) + 1}`,
      },
    });
    console.log(`✅ Mata pelajaran ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah News =====
  for (let i = 0; i < 5; i++) {
    await prisma.news.create({
      data: {
        title: `Berita Sekolah ${i + 1}`,
        content: `Konten berita sekolah ${i + 1}`,
        image: `https://via.placeholder.com/600x400?text=Berita+${i + 1}`,
        guruId: guruIds[i % guruIds.length].id,
      },
    });
    console.log(`✅ News ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Gallery =====
  for (let i = 0; i < 6; i++) {
    await prisma.gallery.create({
      data: {
        image: `https://via.placeholder.com/400x300?text=Galeri+${i + 1}`,
        guruId: guruIds[i % guruIds.length].id,
      },
    });
    console.log(`✅ Gallery ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Guru Template =====
  for (let i = 0; i < 5; i++) {
    await prisma.guruTemplate.create({
      data: {
        name: `Template Guru ${i + 1}`,
        image: `https://via.placeholder.com/300x300?text=Template+${i + 1}`,
        guruId: guruIds[i % guruIds.length].id,
      },
    });
    console.log(`✅ Guru Template ${i + 1} berhasil ditambahkan.`);
  }

  // ===== Tambah Pendaftaran Siswa =====
  for (let i = 0; i < 6; i++) {
    await prisma.pendaftaranSiswa.create({
      data: {
        kategori: "Umum",
        studentName: `Pendaftar ${i + 1}`,
        parentName: `Ortu ${i + 1}`,
        yourLocation: "Jakarta",
        phoneNumber: `08123400${100 + i}`,
        email: `pendaftar${i + 1}@mail.com`,
      },
    });
    console.log(`✅ Pendaftaran siswa ${i + 1} berhasil ditambahkan.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
