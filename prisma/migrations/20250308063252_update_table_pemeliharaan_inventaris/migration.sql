/*
  Warnings:

  - Added the required column `idinventaris` to the `Pemeliharaan_Inventaris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pemeliharaan_Inventaris" ADD COLUMN     "idinventaris" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Pemeliharaan_Inventaris" ADD CONSTRAINT "Pemeliharaan_Inventaris_idinventaris_fkey" FOREIGN KEY ("idinventaris") REFERENCES "Inventaris"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
