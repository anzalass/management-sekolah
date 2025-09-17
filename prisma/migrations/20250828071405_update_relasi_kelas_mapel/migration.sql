/*
  Warnings:

  - Added the required column `idKelasMapel` to the `SummaryMateri` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idKelasMapel` to the `SummaryTugas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SummaryMateri" ADD COLUMN     "idKelasMapel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SummaryTugas" ADD COLUMN     "idKelasMapel" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
