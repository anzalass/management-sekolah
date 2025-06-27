/*
  Warnings:

  - You are about to drop the column `nip` on the `Kelas` table. All the data in the column will be lost.
  - Added the required column `nipGuru` to the `Kelas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kelas" DROP CONSTRAINT "Kelas_nip_fkey";

-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "nip",
ADD COLUMN     "nipGuru" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
