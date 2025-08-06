/*
  Warnings:

  - Added the required column `tanggal` to the `Arsip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Arsip" ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL;
