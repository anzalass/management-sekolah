/*
  Warnings:

  - A unique constraint covering the columns `[noTeleponOrtu]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tahunAjaran` to the `KegiatanSekolah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KegiatanSekolah" ADD COLUMN     "tahunAjaran" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_noTeleponOrtu_key" ON "Siswa"("noTeleponOrtu");
