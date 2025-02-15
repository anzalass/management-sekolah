/*
  Warnings:

  - Added the required column `logoId` to the `Sekolah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sekolah" ADD COLUMN     "logoId" TEXT NOT NULL;
