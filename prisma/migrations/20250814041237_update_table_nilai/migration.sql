/*
  Warnings:

  - A unique constraint covering the columns `[idSiswa,idJenisNilai]` on the table `NilaiSiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NilaiSiswa_idSiswa_idJenisNilai_key" ON "NilaiSiswa"("idSiswa", "idJenisNilai");
