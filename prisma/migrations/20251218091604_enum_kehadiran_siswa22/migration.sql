/*
  Warnings:

  - The `keterangan` column on the `KehadiranSiswa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "KeteranganKehadiranSiswa" AS ENUM ('Izin', 'Hadir', 'Sakit', 'Tanpa Keterangan');

-- AlterTable
ALTER TABLE "KehadiranSiswa" DROP COLUMN "keterangan",
ADD COLUMN     "keterangan" "KeteranganKehadiranSiswa";
