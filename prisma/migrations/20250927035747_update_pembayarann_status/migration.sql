/*
  Warnings:

  - Changed the type of `status` on the `RiwayatPembayaran` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Tagihan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TagihanStatus" AS ENUM ('BELUM BAYAR', 'LUNAS');

-- CreateEnum
CREATE TYPE "RiwayatPembayaranStatus" AS ENUM ('BELUM TERBAYAR', 'TERBAYAR', 'PENDING', 'GAGAL');

-- AlterTable
ALTER TABLE "RiwayatPembayaran" DROP COLUMN "status",
ADD COLUMN     "status" "RiwayatPembayaranStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Tagihan" DROP COLUMN "status",
ADD COLUMN     "status" "TagihanStatus" NOT NULL;
