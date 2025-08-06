/*
  Warnings:

  - Added the required column `tanggal` to the `MateriMapel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Deadline` to the `TugasMapel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MateriMapel" ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TugasMapel" ADD COLUMN     "Deadline" TIMESTAMP(3) NOT NULL;
