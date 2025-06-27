/*
  Warnings:

  - Added the required column `foto` to the `KehadiranGuru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KehadiranGuru" ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "status" TEXT;
