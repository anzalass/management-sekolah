/*
  Warnings:

  - You are about to drop the column `nipSiswa` on the `DaftarSiswaKelas` table. All the data in the column will be lost.
  - You are about to drop the column `nipSiswa` on the `DaftarSiswaMapel` table. All the data in the column will be lost.
  - You are about to drop the column `nipSiswa` on the `RiwayatPembayaran` table. All the data in the column will be lost.
  - You are about to drop the column `nipSiswa` on the `Tagihan` table. All the data in the column will be lost.
  - Added the required column `nisSiswa` to the `DaftarSiswaKelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `DaftarSiswaMapel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `RiwayatPembayaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `Tagihan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DaftarSiswaKelas" DROP COLUMN "nipSiswa",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DaftarSiswaMapel" DROP COLUMN "nipSiswa",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiwayatPembayaran" DROP COLUMN "nipSiswa",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tagihan" DROP COLUMN "nipSiswa",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;
