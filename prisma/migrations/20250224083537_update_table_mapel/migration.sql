/*
  Warnings:

  - Added the required column `tanggal` to the `RiwayatAnggaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiwayatAnggaran" ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL;
