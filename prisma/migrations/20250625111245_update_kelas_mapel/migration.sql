/*
  Warnings:

  - You are about to drop the column `nip` on the `KelasDanMapel` table. All the data in the column will be lost.
  - Added the required column `nipGuru` to the `KelasDanMapel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KelasDanMapel" DROP CONSTRAINT "KelasDanMapel_nip_fkey";

-- AlterTable
ALTER TABLE "KelasDanMapel" DROP COLUMN "nip",
ADD COLUMN     "nipGuru" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "KelasDanMapel" ADD CONSTRAINT "KelasDanMapel_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
