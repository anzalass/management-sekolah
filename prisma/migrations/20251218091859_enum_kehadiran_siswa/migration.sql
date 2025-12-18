/*
  Warnings:

  - Made the column `keterangan` on table `KehadiranSiswa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "KehadiranSiswa" ALTER COLUMN "keterangan" SET NOT NULL;
