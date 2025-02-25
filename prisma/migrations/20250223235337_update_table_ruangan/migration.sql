/*
  Warnings:

  - You are about to drop the `RuangKelas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RuangKelas";

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);
