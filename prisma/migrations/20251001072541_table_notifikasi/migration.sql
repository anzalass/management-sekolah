/*
  Warnings:

  - Changed the type of `createdAt` on the `SnapUrl` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SnapUrl" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT,
    "idKelas" TEXT,
    "idGuru" TEXT,
    "redirectSiswa" TEXT,
    "redirectGuru" TEXT,
    "status" TEXT NOT NULL,
    "idTerkait" TEXT,
    "kategori" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SnapUrl" ADD CONSTRAINT "SnapUrl_idTagihan_fkey" FOREIGN KEY ("idTagihan") REFERENCES "Tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
