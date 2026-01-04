/*
  Warnings:

  - The values [TanpaKeterangan] on the enum `KeteranganKehadiranSiswa` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KeteranganKehadiranSiswa_new" AS ENUM ('Izin', 'Hadir', 'Sakit', 'Tanpa Keterangan');
ALTER TABLE "KehadiranSiswa" ALTER COLUMN "keterangan" TYPE "KeteranganKehadiranSiswa_new" USING ("keterangan"::text::"KeteranganKehadiranSiswa_new");
ALTER TYPE "KeteranganKehadiranSiswa" RENAME TO "KeteranganKehadiranSiswa_old";
ALTER TYPE "KeteranganKehadiranSiswa_new" RENAME TO "KeteranganKehadiranSiswa";
DROP TYPE "KeteranganKehadiranSiswa_old";
COMMIT;
