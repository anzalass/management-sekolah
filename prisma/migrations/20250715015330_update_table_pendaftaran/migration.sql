/*
  Warnings:

  - Added the required column `kategori` to the `PendaftaranSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendaftaranSiswa" ADD COLUMN     "kategori" TEXT NOT NULL;
