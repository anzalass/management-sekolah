-- CreateTable
CREATE TABLE "Sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kas" INTEGER NOT NULL,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "nip" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ruangKelas" TEXT NOT NULL,
    "periode" TEXT NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPendidikanGuru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenjangPendidikan" TEXT NOT NULL,
    "tahunLulus" TEXT NOT NULL,

    CONSTRAINT "RiwayatPendidikanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaktuMengajar" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "ruangKelas" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "kelasDanMapelId" TEXT NOT NULL,

    CONSTRAINT "WaktuMengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelasDanMapel" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "ruangKelas" TEXT NOT NULL,

    CONSTRAINT "KelasDanMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswa" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "nis" TEXT NOT NULL,

    CONSTRAINT "DaftarSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaftarSiswaKelas" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "nis" TEXT NOT NULL,

    CONSTRAINT "DaftarSiswaKelas_pkey" PRIMARY KEY ("id")
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
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TIMESTAMP(3) NOT NULL,
    "namaAyah" TEXT NOT NULL,
    "namaIbu" TEXT NOT NULL,
    "tahunLulus" TIMESTAMP(3) NOT NULL,
    "poin" INTEGER NOT NULL,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("nis")
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
CREATE TABLE "RuangKelas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "RuangKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventaris" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hargaBeli" INTEGER NOT NULL,
    "waktuPengadaan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatAnggaran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "RiwayatAnggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KegiatanSekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KegiatanSekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerizinanGuru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerizinanGuru_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_nip_key" ON "Kelas"("nip");

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendidikanGuru" ADD CONSTRAINT "RiwayatPendidikanGuru_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaktuMengajar" ADD CONSTRAINT "WaktuMengajar_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaktuMengajar" ADD CONSTRAINT "WaktuMengajar_kelasDanMapelId_fkey" FOREIGN KEY ("kelasDanMapelId") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasDanMapel" ADD CONSTRAINT "KelasDanMapel_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswa" ADD CONSTRAINT "DaftarSiswa_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswa" ADD CONSTRAINT "DaftarSiswa_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaftarSiswaKelas" ADD CONSTRAINT "DaftarSiswaKelas_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "PerizinanGuru" ADD CONSTRAINT "PerizinanGuru_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_idBuku_fkey" FOREIGN KEY ("idBuku") REFERENCES "Buku_Perpustakaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
