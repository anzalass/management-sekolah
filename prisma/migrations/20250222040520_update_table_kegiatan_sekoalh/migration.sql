/*
  Warnings:

  - You are about to drop the column `time` on the `KegiatanSekolah` table. All the data in the column will be lost.
  - Added the required column `waktuMulai` to the `KegiatanSekolah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktuSelesai` to the `KegiatanSekolah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KegiatanSekolah" DROP COLUMN "time",
ADD COLUMN     "waktuMulai" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waktuSelesai" TIMESTAMP(3) NOT NULL;
