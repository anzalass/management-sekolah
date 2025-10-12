/*
  Warnings:

  - Added the required column `kategori` to the `CatatanPerkembanganSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CatatanPerkembanganSiswa" ADD COLUMN     "kategori" TEXT NOT NULL,
ADD COLUMN     "namaGuru" TEXT;
