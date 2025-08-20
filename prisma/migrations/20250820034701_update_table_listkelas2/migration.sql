/*
  Warnings:

  - A unique constraint covering the columns `[namaKelas]` on the table `ListKelas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListKelas_namaKelas_key" ON "ListKelas"("namaKelas");
