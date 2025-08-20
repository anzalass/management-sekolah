/*
  Warnings:

  - Added the required column `nisSiswa` to the `Konseling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `Pelanggaran_Dan_Prestasi_Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Konseling" ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pelanggaran_Dan_Prestasi_Siswa" ADD COLUMN     "nisSiswa" TEXT NOT NULL;
