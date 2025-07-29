/*
  Warnings:

  - Added the required column `parentName` to the `Testimoni` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimoni" ADD COLUMN     "parentName" TEXT NOT NULL;
