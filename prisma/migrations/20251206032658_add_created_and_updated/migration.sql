/*
  Warnings:

  - You are about to drop the column `createdAt` on the `NilaiSiswa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notifikasi` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SelesaiUjian` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SnapUrl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Arsip" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DaftarSiswaKelas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DaftarSiswaMapel" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FotoSummaryMateri" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FotoSummaryTugas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FotoWeeklyActivity" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "HistoryInventaris" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Inventaris" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "JadwalPelajaran" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "JanjiTemu" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "JenisNilai" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Jenis_Inventaris" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KegiatanSekolah" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KehadiranGuru" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KehadiranSiswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Kelas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KelasDanMapel" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Konseling" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ListKelas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Mata_Pelajaran" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MateriMapel" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "NilaiSiswa" DROP COLUMN "createdAt",
ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Notifikasi" DROP COLUMN "createdAt",
ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PendaftaranSiswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Periode_Tahun_Ajaran" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PerizinanGuru" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RiwayatAnggaran" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RiwayatPembayaran" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RiwayatPendidikanGuru" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ruangan" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Sekolah" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SelesaiUjian" DROP COLUMN "createdAt",
ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SnapUrl" DROP COLUMN "createdAt",
ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SummaryMateri" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SummaryTugas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Testimoni" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TugasMapel" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UjianIframe" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WeeklyActivity" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "jadwalMengajar" ADD COLUMN     "createdOn" TIMESTAMP(3),
ADD COLUMN     "modifiedOn" TIMESTAMP(3);
