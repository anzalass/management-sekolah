/*
  Warnings:

  - Added the required column `ruang` to the `Pemeliharaan_Inventaris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pemeliharaan_Inventaris" ADD COLUMN     "ruang" TEXT NOT NULL;
