/*
  Warnings:

  - Added the required column `imageId` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `GuruTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuruTemplate" ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "imageId" TEXT NOT NULL;
