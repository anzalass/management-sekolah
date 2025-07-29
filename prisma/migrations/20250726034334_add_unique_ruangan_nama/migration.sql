/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Ruangan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ruangan_nama_key" ON "Ruangan"("nama");
