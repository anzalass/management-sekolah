/*
  Warnings:

  - Added the required column `metodeBayar` to the `RiwayatPembayaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiwayatPembayaran" ADD COLUMN     "metodeBayar" TEXT NOT NULL;
