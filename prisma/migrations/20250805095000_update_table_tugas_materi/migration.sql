/*
  Warnings:

  - Added the required column `konten` to the `MateriMapel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `konten` to the `TugasMapel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MateriMapel" ADD COLUMN     "konten" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TugasMapel" ADD COLUMN     "konten" TEXT NOT NULL;
