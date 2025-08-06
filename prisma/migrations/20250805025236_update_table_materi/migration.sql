/*
  Warnings:

  - You are about to drop the column `nis` on the `RiwayatPembayaran` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `Tagihan` table. All the data in the column will be lost.
  - Added the required column `nisSiswa` to the `RiwayatPembayaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `Tagihan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RiwayatPembayaran" DROP CONSTRAINT "RiwayatPembayaran_nis_fkey";

-- DropForeignKey
ALTER TABLE "Tagihan" DROP CONSTRAINT "Tagihan_nis_fkey";

-- AlterTable
ALTER TABLE "MateriMapel" ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "pdfUrlId" TEXT;

-- AlterTable
ALTER TABLE "RiwayatPembayaran" DROP COLUMN "nis",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tagihan" DROP COLUMN "nis",
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
