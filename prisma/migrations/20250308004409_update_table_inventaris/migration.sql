/*
  Warnings:

  - Added the required column `quantity` to the `Inventaris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventaris" ADD COLUMN     "quantity" INTEGER NOT NULL;
