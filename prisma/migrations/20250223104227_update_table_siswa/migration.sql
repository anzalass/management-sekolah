/*
  Warnings:

  - Changed the type of `tanggalLahir` on the `Siswa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Siswa" DROP COLUMN "tanggalLahir",
ADD COLUMN     "tanggalLahir" TIMESTAMP(3) NOT NULL;
