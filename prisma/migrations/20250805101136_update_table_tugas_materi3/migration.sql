/*
  Warnings:

  - You are about to drop the column `Deadline` on the `TugasMapel` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `TugasMapel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TugasMapel" DROP COLUMN "Deadline",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
