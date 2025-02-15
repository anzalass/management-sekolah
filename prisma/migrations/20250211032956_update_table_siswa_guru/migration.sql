/*
  Warnings:

  - Added the required column `nik` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "nik" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "nik" TEXT NOT NULL;
