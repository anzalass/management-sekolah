/*
  Warnings:

  - You are about to drop the column `nis` on the `Pelanggaran_Dan_Prestasi_Siswa` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `Peminjaman_dan_Pengembalian` table. All the data in the column will be lost.
  - Added the required column `nisSiswa` to the `Pelanggaran_Dan_Prestasi_Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `Peminjaman_dan_Pengembalian` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Peminjaman_dan_Pengembalian` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusPeminjamanBuku" AS ENUM ('dipinjam', 'dikembalikan');

-- DropForeignKey
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" DROP CONSTRAINT "Pelanggaran_Dan_Prestasi_Siswa_nis_fkey";

-- DropForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" DROP CONSTRAINT "Peminjaman_dan_Pengembalian_nis_fkey";

-- AlterTable
ALTER TABLE "Buku_Perpustakaan" ADD COLUMN     "filePdfid" TEXT,
ADD COLUMN     "filepdf" TEXT;

-- AlterTable
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" DROP COLUMN "nis",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Peminjaman_dan_Pengembalian" DROP COLUMN "nis",
ADD COLUMN     "nisSiswa" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusPeminjamanBuku" NOT NULL,
ALTER COLUMN "keterangan" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Konseling" (
    "id" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "namaSiswa" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Konseling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Konseling" ADD CONSTRAINT "Konseling_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" ADD CONSTRAINT "Pelanggaran_Dan_Prestasi_Siswa_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD CONSTRAINT "Peminjaman_dan_Pengembalian_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
