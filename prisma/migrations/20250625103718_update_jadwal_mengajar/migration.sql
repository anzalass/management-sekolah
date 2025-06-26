/*
  Warnings:

  - Added the required column `kelas` to the `jadwalMengajar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jadwalMengajar" ADD COLUMN     "kelas" TEXT NOT NULL;
