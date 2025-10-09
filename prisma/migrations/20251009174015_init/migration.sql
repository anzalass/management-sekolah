-- CreateEnum
CREATE TYPE "StatusGuru" AS ENUM ('Aktif', 'NonAktif');

-- CreateEnum
CREATE TYPE "StatusIzin" AS ENUM ('menunggu', 'disetujui', 'ditolak');

-- CreateEnum
CREATE TYPE "StatusPeminjamanBuku" AS ENUM ('dipinjam', 'dikembalikan');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('BELUM BAYAR', 'LUNAS', 'MENUNGGU_KONFIRMASI', 'BUKTI_TIDAK_VALID', 'PENDING', 'GAGAL');

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
    "status" "StatusGuru" NOT NULL,
    "foto" TEXT,
    "fotoId" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwalMengajar" (
    "id" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "idGuru" TEXT NOT NULL,
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
    "idGuru" TEXT NOT NULL,
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
    "idGuru" TEXT,
    "nama" TEXT NOT NULL,
    "namaGuru" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "banner" TEXT,
    "bannerId" TEXT,
    "ruangKelas" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalPelajaran" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,

    CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPendidikanGuru" (
    "id" TEXT NOT NULL,
    "idGuru" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "gelar" TEXT NOT NULL,
    "jenjangPendidikan" TEXT NOT NULL,
    "tahunLulus" TEXT NOT NULL,

    CONSTRAINT "RiwayatPendidikanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelasDanMapel" (
    "id" TEXT NOT NULL,
    "idGuru" TEXT,
    "namaMapel" TEXT NOT NULL,
    "namaGuru" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "ruangKelas" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "banner" TEXT,
    "bannerId" TEXT,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "KelasDanMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswaMapel" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "namaSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "banner" TEXT,
    "bannerId" TEXT,

    CONSTRAINT "DaftarSiswaMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswaKelas" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "rapotSiswa" TEXT,
    "idSiswa" TEXT NOT NULL,
    "namaSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,

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
    "idSiswa" TEXT NOT NULL,
    "idKelasDanMapel" TEXT NOT NULL,
    "idJenisNilai" TEXT NOT NULL,
    "jenisNilai" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "NilaiSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KehadiranSiswa" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT,
    "idKelas" TEXT,
    "namaSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
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
    "password" TEXT,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "tahunLulus" TEXT,
    "poin" INTEGER,
    "alamat" TEXT,
    "agama" TEXT NOT NULL,
    "kelas" TEXT,
    "jenisKelamin" TEXT NOT NULL,
    "foto" TEXT,
    "fotoId" TEXT,
    "noTelepon" TEXT NOT NULL,
    "noTeleponOrtu" TEXT NOT NULL,
    "email" TEXT,
    "ekstraKulikulerPeminatan" TEXT,
    "ekstraKulikulerWajib" TEXT,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konseling" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "namaSiswa" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Konseling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelanggaran_Dan_Prestasi_Siswa" (
    "id" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
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
    "idinventaris" TEXT,
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
    "idGuru" TEXT,
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
    "idSiswa" TEXT NOT NULL,
    "idKelas" TEXT,
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
    "idGuru" TEXT NOT NULL,
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
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengumumanKelas" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PengumumanKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatatanPerkembanganSiswa" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT,
    "idSiswa" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatatanPerkembanganSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatatanAkhirSiswa" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT,
    "idSiswa" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "CatatanAkhirSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buku_Perpustakaan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "cover" TEXT,
    "cover_id" TEXT,
    "filepdf" TEXT,
    "filePdfid" TEXT,
    "pengarang" TEXT NOT NULL,
    "penerbit" TEXT NOT NULL,
    "tahunTerbit" INTEGER NOT NULL,
    "keterangan" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "Buku_Perpustakaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman_dan_Pengembalian" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idBuku" TEXT,
    "namaBuku" TEXT NOT NULL,
    "waktuPinjam" TIMESTAMP(3) NOT NULL,
    "waktuKembali" TIMESTAMP(3) NOT NULL,
    "status" "StatusPeminjamanBuku" NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "Peminjaman_dan_Pengembalian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListKelas" (
    "id" TEXT NOT NULL,
    "namaKelas" TEXT NOT NULL,

    CONSTRAINT "ListKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mata_Pelajaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

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
    "namaSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idSiswa" TEXT,
    "waktu" TIMESTAMP(3) NOT NULL,
    "buktiUrl" TEXT,
    "buktiId" TEXT,
    "jatuhTempo" TIMESTAMP(3) NOT NULL,
    "status" "StatusPembayaran" NOT NULL,
    "keterangan" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnapUrl" (
    "id" TEXT NOT NULL,
    "idTagihan" TEXT NOT NULL,
    "snap_url" TEXT NOT NULL,
    "snapToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnapUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPembayaran" (
    "id" TEXT NOT NULL,
    "namaSiswa" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idSiswa" TEXT,
    "idTagihan" TEXT NOT NULL,
    "waktuBayar" TIMESTAMP(3) NOT NULL,
    "status" "StatusPembayaran" NOT NULL,
    "metodeBayar" TEXT NOT NULL,
    "snapToken" TEXT,
    "snapRedirectUrl" TEXT,

    CONSTRAINT "RiwayatPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimoni" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
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
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
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
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guruId" TEXT,

    CONSTRAINT "GuruTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendaftaranSiswa" (
    "id" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "yourLocation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "PendaftaranSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriMapel" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "iframeGoogleSlide" TEXT,
    "iframeYoutube" TEXT,
    "pdfUrl" TEXT,
    "pdfUrlId" TEXT,

    CONSTRAINT "MateriMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UjianIframe" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "iframe" TEXT NOT NULL,

    CONSTRAINT "UjianIframe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelesaiUjian" (
    "id" TEXT NOT NULL,
    "idUjianIframe" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelesaiUjian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryMateri" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idMateri" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SummaryMateri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSummaryMateri" (
    "id" TEXT NOT NULL,
    "idSummaryMateri" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idMateri" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoSummaryMateri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasMapel" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "iframeGoogleSlide" TEXT,
    "iframeYoutube" TEXT,
    "pdfUrl" TEXT,
    "pdfUrlId" TEXT,

    CONSTRAINT "TugasMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryTugas" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idTugas" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SummaryTugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSummaryTugas" (
    "id" TEXT NOT NULL,
    "idSummaryTugas" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idTugas" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoSummaryTugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arsip" (
    "id" TEXT NOT NULL,
    "namaBerkas" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "url_id" TEXT NOT NULL,

    CONSTRAINT "Arsip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JanjiTemu" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idGuru" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "JanjiTemu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyActivity" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "judul" TEXT,
    "content" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoWeeklyActivity" (
    "id" TEXT NOT NULL,
    "idWeeklyActivity" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoWeeklyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT,
    "idKelas" TEXT,
    "idGuru" TEXT,
    "redirectSiswa" TEXT,
    "redirectGuru" TEXT,
    "status" TEXT NOT NULL,
    "idTerkait" TEXT,
    "kategori" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DaftarSiswaMapel_idSiswa_idKelas_key" ON "DaftarSiswaMapel"("idSiswa", "idKelas");

-- CreateIndex
CREATE UNIQUE INDEX "DaftarSiswaKelas_idSiswa_idKelas_key" ON "DaftarSiswaKelas"("idSiswa", "idKelas");

-- CreateIndex
CREATE UNIQUE INDEX "NilaiSiswa_idSiswa_idJenisNilai_key" ON "NilaiSiswa"("idSiswa", "idJenisNilai");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_email_key" ON "Siswa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ruangan_nama_key" ON "Ruangan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Jenis_Inventaris_nama_key" ON "Jenis_Inventaris"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "CatatanAkhirSiswa_idSiswa_idKelasMapel_key" ON "CatatanAkhirSiswa"("idSiswa", "idKelasMapel");

-- CreateIndex
CREATE UNIQUE INDEX "ListKelas_namaKelas_key" ON "ListKelas"("namaKelas");

-- CreateIndex
CREATE UNIQUE INDEX "SelesaiUjian_idSiswa_idKelasMapel_idUjianIframe_key" ON "SelesaiUjian"("idSiswa", "idKelasMapel", "idUjianIframe");

-- AddForeignKey
ALTER TABLE "jadwalMengajar" ADD CONSTRAINT "jadwalMengajar_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranGuru" ADD CONSTRAINT "KehadiranGuru_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendidikanGuru" ADD CONSTRAINT "RiwayatPendidikanGuru_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasDanMapel" ADD CONSTRAINT "KelasDanMapel_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaMapel" ADD CONSTRAINT "DaftarSiswaMapel_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaMapel" ADD CONSTRAINT "DaftarSiswaMapel_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JenisNilai" ADD CONSTRAINT "JenisNilai_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_idKelasDanMapel_fkey" FOREIGN KEY ("idKelasDanMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_idJenisNilai_fkey" FOREIGN KEY ("idJenisNilai") REFERENCES "JenisNilai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranSiswa" ADD CONSTRAINT "KehadiranSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KehadiranSiswa" ADD CONSTRAINT "KehadiranSiswa_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Konseling" ADD CONSTRAINT "Konseling_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" ADD CONSTRAINT "Pelanggaran_Dan_Prestasi_Siswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemeliharaan_Inventaris" ADD CONSTRAINT "Pemeliharaan_Inventaris_idinventaris_fkey" FOREIGN KEY ("idinventaris") REFERENCES "Inventaris"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerizinanGuru" ADD CONSTRAINT "PerizinanGuru_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerizinanSiswa" ADD CONSTRAINT "PerizinanSiswa_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerizinanSiswa" ADD CONSTRAINT "PerizinanSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumumanKelas" ADD CONSTRAINT "PengumumanKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatatanPerkembanganSiswa" ADD CONSTRAINT "CatatanPerkembanganSiswa_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatatanPerkembanganSiswa" ADD CONSTRAINT "CatatanPerkembanganSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatatanAkhirSiswa" ADD CONSTRAINT "CatatanAkhirSiswa_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatatanAkhirSiswa" ADD CONSTRAINT "CatatanAkhirSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_idBuku_fkey" FOREIGN KEY ("idBuku") REFERENCES "Buku_Perpustakaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapUrl" ADD CONSTRAINT "SnapUrl_idTagihan_fkey" FOREIGN KEY ("idTagihan") REFERENCES "Tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_idTagihan_fkey" FOREIGN KEY ("idTagihan") REFERENCES "Tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimoni" ADD CONSTRAINT "Testimoni_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuruTemplate" ADD CONSTRAINT "GuruTemplate_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriMapel" ADD CONSTRAINT "MateriMapel_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianIframe" ADD CONSTRAINT "UjianIframe_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idUjianIframe_fkey" FOREIGN KEY ("idUjianIframe") REFERENCES "UjianIframe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_idMateri_fkey" FOREIGN KEY ("idMateri") REFERENCES "MateriMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idSummaryMateri_fkey" FOREIGN KEY ("idSummaryMateri") REFERENCES "SummaryMateri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idMateri_fkey" FOREIGN KEY ("idMateri") REFERENCES "MateriMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasMapel" ADD CONSTRAINT "TugasMapel_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_idTugas_fkey" FOREIGN KEY ("idTugas") REFERENCES "TugasMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idSummaryTugas_fkey" FOREIGN KEY ("idSummaryTugas") REFERENCES "SummaryTugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idTugas_fkey" FOREIGN KEY ("idTugas") REFERENCES "TugasMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JanjiTemu" ADD CONSTRAINT "JanjiTemu_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JanjiTemu" ADD CONSTRAINT "JanjiTemu_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyActivity" ADD CONSTRAINT "WeeklyActivity_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoWeeklyActivity" ADD CONSTRAINT "FotoWeeklyActivity_idWeeklyActivity_fkey" FOREIGN KEY ("idWeeklyActivity") REFERENCES "WeeklyActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
