/*
  Warnings:

  - Added the required column `kategori` to the `Konseling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Konseling" ADD COLUMN     "kategori" TEXT NOT NULL;
