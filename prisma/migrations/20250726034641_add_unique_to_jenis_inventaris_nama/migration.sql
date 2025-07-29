/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Jenis_Inventaris` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jenis_Inventaris_nama_key" ON "Jenis_Inventaris"("nama");
