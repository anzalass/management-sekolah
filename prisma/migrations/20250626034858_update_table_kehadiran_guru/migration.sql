/*
  Warnings:

  - You are about to drop the `Kehadiran_Guru_Dan_Staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kehadiran_Guru_Dan_Staff" DROP CONSTRAINT "Kehadiran_Guru_Dan_Staff_nip_fkey";

-- DropTable
DROP TABLE "Kehadiran_Guru_Dan_Staff";

-- CreateTable
CREATE TABLE "KehadiranGuru" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jamMasuk" TIMESTAMP(3),
    "jamPulang" TIMESTAMP(3),
    "fotoMasuk" TEXT,
    "fotoPulang" TEXT,
    "lokasiMasuk" TEXT,
    "lokasiPulang" TEXT,

    CONSTRAINT "KehadiranGuru_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KehadiranGuru" ADD CONSTRAINT "KehadiranGuru_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
