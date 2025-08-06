/*
  Warnings:

  - Added the required column `waktu` to the `SummaryMateri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu` to the `SummaryTugas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SummaryMateri" ADD COLUMN     "waktu" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SummaryTugas" ADD COLUMN     "waktu" TIMESTAMP(3) NOT NULL;
