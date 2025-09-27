/*
  Warnings:

  - The values [BELUM TERBAYAR,TERBAYAR] on the enum `RiwayatPembayaranStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RiwayatPembayaranStatus_new" AS ENUM ('BELUM BAYAR', 'LUNAS', 'PENDING', 'GAGAL');
ALTER TABLE "RiwayatPembayaran" ALTER COLUMN "status" TYPE "RiwayatPembayaranStatus_new" USING ("status"::text::"RiwayatPembayaranStatus_new");
ALTER TYPE "RiwayatPembayaranStatus" RENAME TO "RiwayatPembayaranStatus_old";
ALTER TYPE "RiwayatPembayaranStatus_new" RENAME TO "RiwayatPembayaranStatus";
DROP TYPE "RiwayatPembayaranStatus_old";
COMMIT;
