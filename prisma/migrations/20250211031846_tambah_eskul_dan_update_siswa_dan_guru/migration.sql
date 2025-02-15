/*
  Warnings:

  - Added the required column `agama` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisKelamin` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noTelepon` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agama` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ekstraKulikulerPeminatan` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ekstraKulikulerWajib` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisKelamin` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noTelepon` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "agama" TEXT NOT NULL,
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "jenisKelamin" TEXT NOT NULL,
ADD COLUMN     "noTelepon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "agama" TEXT NOT NULL,
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "ekstraKulikulerPeminatan" TEXT NOT NULL,
ADD COLUMN     "ekstraKulikulerWajib" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "jenisKelamin" TEXT NOT NULL,
ADD COLUMN     "noTelepon" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EkstraKulikuler" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "jenis" TEXT NOT NULL,

    CONSTRAINT "EkstraKulikuler_pkey" PRIMARY KEY ("id")
);
