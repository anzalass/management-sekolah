-- CreateEnum
CREATE TYPE "StatusIzin" AS ENUM ('menunggu', 'disetujui', 'ditolak');

-- CreateTable
CREATE TABLE "Sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "kas" INTEGER,
    "desa" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "namaKepsek" TEXT NOT NULL,
    "logo" TEXT,
    "logoId" TEXT,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "alamat" TEXT NOT NULL,
    "agama" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "foto" TEXT,
    "fotoId" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwalMengajar" (
    "id" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "ruang" TEXT NOT NULL,

    CONSTRAINT "jadwalMengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KehadiranGuru" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jamMasuk" TIMESTAMP(3),
    "jamPulang" TIMESTAMP(3),
    "fotoMasuk" TEXT,
    "lokasiMasuk" TEXT,
    "lokasiPulang" TEXT,
    "status" TEXT,

    CONSTRAINT "KehadiranGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ruangKelas" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPendidikanGuru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "gelar" TEXT NOT NULL,
    "jenjangPendidikan" TEXT NOT NULL,
    "tahunLulus" TEXT NOT NULL,

    CONSTRAINT "RiwayatPendidikanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelasDanMapel" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "ruangKelas" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "KelasDanMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswaMapel" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "nis" TEXT NOT NULL,

    CONSTRAINT "DaftarSiswaMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswaKelas" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "nis" TEXT NOT NULL,

    CONSTRAINT "DaftarSiswaKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisNilai" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "bobot" INTEGER NOT NULL,

    CONSTRAINT "JenisNilai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NilaiSiswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "idKelasDanMapel" TEXT NOT NULL,
    "jenisNilai" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,

    CONSTRAINT "NilaiSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KehadiranSiswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "idKelasDanMapel" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "KehadiranSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jurusan" TEXT,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "tahunLulus" TEXT NOT NULL,
    "poin" INTEGER,
    "alamat" TEXT,
    "agama" TEXT NOT NULL,
    "kelas" TEXT,
    "jenisKelamin" TEXT NOT NULL,
    "foto" TEXT,
    "fotoId" TEXT,
    "noTelepon" TEXT,
    "noTeleponOrtu" TEXT NOT NULL,
    "email" TEXT,
    "ekstraKulikulerPeminatan" TEXT,
    "ekstraKulikulerWajib" TEXT,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelanggaran_Dan_Prestasi_Siswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "poin" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Pelanggaran_Dan_Prestasi_Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jenis_Inventaris" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Jenis_Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventaris" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ruang" TEXT NOT NULL,
    "hargaBeli" INTEGER NOT NULL,
    "waktuPengadaan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemeliharaan_Inventaris" (
    "id" TEXT NOT NULL,
    "idinventaris" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ruang" TEXT NOT NULL,
    "biaya" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Pemeliharaan_Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatAnggaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "RiwayatAnggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KegiatanSekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "waktuMulai" TIMESTAMP(3) NOT NULL,
    "waktuSelesai" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "KegiatanSekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerizinanGuru" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "bukti" TEXT NOT NULL,
    "bukti_id" TEXT NOT NULL,
    "status" "StatusIzin" NOT NULL,

    CONSTRAINT "PerizinanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerizinanSiswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "bukti" TEXT NOT NULL,
    "bukti_id" TEXT NOT NULL,
    "status" "StatusIzin" NOT NULL,

    CONSTRAINT "PerizinanSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EkstraKulikuler" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "jenis" TEXT NOT NULL,

    CONSTRAINT "EkstraKulikuler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buku_Perpustakaan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "pengarang" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "tahunTerbit" INTEGER NOT NULL,
    "keterangan" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "Buku_Perpustakaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman_dan_Pengembalian" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "idBuku" TEXT NOT NULL,
    "waktuPinjam" TIMESTAMP(3) NOT NULL,
    "waktuKembali" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Peminjaman_dan_Pengembalian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mata_Pelajaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,

    CONSTRAINT "Mata_Pelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periode_Tahun_Ajaran" (
    "id" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "Periode_Tahun_Ajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagihan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "jatuhTempo" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPembayaran" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "idTagihan" TEXT NOT NULL,
    "waktuBayar" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiwayatPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimoni" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "Testimoni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuruTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "GuruTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendaftaranSiswa" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "yourLocation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "PendaftaranSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_noTelepon_key" ON "Siswa"("noTelepon");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_noTeleponOrtu_key" ON "Siswa"("noTeleponOrtu");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_email_key" ON "Siswa"("email");

-- AddForeignKey
ALTER TABLE "jadwalMengajar" ADD CONSTRAINT "jadwalMengajar_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranGuru" ADD CONSTRAINT "KehadiranGuru_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendidikanGuru" ADD CONSTRAINT "RiwayatPendidikanGuru_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasDanMapel" ADD CONSTRAINT "KelasDanMapel_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaMapel" ADD CONSTRAINT "DaftarSiswaMapel_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaMapel" ADD CONSTRAINT "DaftarSiswaMapel_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JenisNilai" ADD CONSTRAINT "JenisNilai_id_fkey" FOREIGN KEY ("id") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_idKelasDanMapel_fkey" FOREIGN KEY ("idKelasDanMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranSiswa" ADD CONSTRAINT "KehadiranSiswa_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranSiswa" ADD CONSTRAINT "KehadiranSiswa_idKelasDanMapel_fkey" FOREIGN KEY ("idKelasDanMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" ADD CONSTRAINT "Pelanggaran_Dan_Prestasi_Siswa_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemeliharaan_Inventaris" ADD CONSTRAINT "Pemeliharaan_Inventaris_idinventaris_fkey" FOREIGN KEY ("idinventaris") REFERENCES "Inventaris"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerizinanGuru" ADD CONSTRAINT "PerizinanGuru_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerizinanSiswa" ADD CONSTRAINT "PerizinanSiswa_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_idBuku_fkey" FOREIGN KEY ("idBuku") REFERENCES "Buku_Perpustakaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mata_Pelajaran" ADD CONSTRAINT "Mata_Pelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimoni" ADD CONSTRAINT "Testimoni_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuruTemplate" ADD CONSTRAINT "GuruTemplate_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
