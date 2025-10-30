/*
  Warnings:

  - You are about to drop the `Pemeliharaan_Inventaris` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pemeliharaan_Inventaris" DROP CONSTRAINT "Pemeliharaan_Inventaris_idinventaris_fkey";

-- DropTable
DROP TABLE "Pemeliharaan_Inventaris";

-- CreateTable
CREATE TABLE "HistoryInventaris" (
    "id" TEXT NOT NULL,
    "idinventaris" TEXT,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ruang" TEXT,
    "biaya" INTEGER,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "HistoryInventaris_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoryInventaris" ADD CONSTRAINT "HistoryInventaris_idinventaris_fkey" FOREIGN KEY ("idinventaris") REFERENCES "Inventaris"("id") ON DELETE SET NULL ON UPDATE CASCADE;
