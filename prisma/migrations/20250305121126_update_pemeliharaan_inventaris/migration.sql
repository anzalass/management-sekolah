/*
  Warnings:

  - Added the required column `ruang` to the `Inventaris` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Pemeliharaan_Inventaris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventaris" ADD COLUMN     "ruang" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pemeliharaan_Inventaris" ADD COLUMN     "status" TEXT NOT NULL;
