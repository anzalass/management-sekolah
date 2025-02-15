/*
  Warnings:

  - A unique constraint covering the columns `[noTelepon]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desa` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kabupaten` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kecamatan` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaKepsek` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `npsn` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinsi` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Sekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Sekolah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guru" ADD COLUMN     "foto" TEXT,
ADD COLUMN     "fotoId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiwayatPendidikanGuru" ALTER COLUMN "fakultas" DROP NOT NULL,
ALTER COLUMN "jurusan" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sekolah" ADD COLUMN     "desa" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "kabupaten" TEXT NOT NULL,
ADD COLUMN     "kecamatan" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "namaKepsek" TEXT NOT NULL,
ADD COLUMN     "npsn" TEXT NOT NULL,
ADD COLUMN     "provinsi" TEXT NOT NULL,
ADD COLUMN     "telephone" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "foto" TEXT,
ADD COLUMN     "fotoId" TEXT,
ALTER COLUMN "jurusan" DROP NOT NULL,
ALTER COLUMN "alamat" DROP NOT NULL,
ALTER COLUMN "ekstraKulikulerPeminatan" DROP NOT NULL,
ALTER COLUMN "ekstraKulikulerWajib" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "noTelepon" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_noTelepon_key" ON "Siswa"("noTelepon");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_email_key" ON "Siswa"("email");
