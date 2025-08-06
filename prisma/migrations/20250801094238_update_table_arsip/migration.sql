/*
  Warnings:

  - Added the required column `url_id` to the `Arsip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Arsip" ADD COLUMN     "url_id" TEXT NOT NULL;
