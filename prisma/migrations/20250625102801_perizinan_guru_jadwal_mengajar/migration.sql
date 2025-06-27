/*
  Warnings:

  - You are about to drop the column `nip` on the `PerizinanGuru` table. All the data in the column will be lost.
  - Added the required column `nipGuru` to the `PerizinanGuru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PerizinanGuru" DROP COLUMN "nip",
ADD COLUMN     "nipGuru" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PerizinanGuru" ADD CONSTRAINT "PerizinanGuru_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
