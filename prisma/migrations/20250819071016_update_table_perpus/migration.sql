/*
  Warnings:

  - Added the required column `nisSiswa` to the `Peminjaman_dan_Pengembalian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD COLUMN     "nisSiswa" TEXT NOT NULL;
