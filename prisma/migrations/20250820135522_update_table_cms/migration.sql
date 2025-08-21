/*
  Warnings:

  - Added the required column `imageId` to the `Testimoni` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimoni" ADD COLUMN     "imageId" TEXT NOT NULL;
