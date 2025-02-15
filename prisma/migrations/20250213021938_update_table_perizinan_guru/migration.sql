/*
  Warnings:

  - Added the required column `timeEnd` to the `PerizinanGuru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PerizinanGuru" ADD COLUMN     "timeEnd" TIMESTAMP(3) NOT NULL;
