/*
  Warnings:

  - Added the required column `fakultas` to the `RiwayatPendidikanGuru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `RiwayatPendidikanGuru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiwayatPendidikanGuru" ADD COLUMN     "fakultas" TEXT NOT NULL,
ADD COLUMN     "jurusan" TEXT NOT NULL;
