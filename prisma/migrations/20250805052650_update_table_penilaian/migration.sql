/*
  Warnings:

  - You are about to drop the column `nis` on the `NilaiSiswa` table. All the data in the column will be lost.
  - Added the required column `idJenisNilai` to the `NilaiSiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisSiswa` to the `NilaiSiswa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JenisNilai" DROP CONSTRAINT "JenisNilai_id_fkey";

-- DropForeignKey
ALTER TABLE "NilaiSiswa" DROP CONSTRAINT "NilaiSiswa_nis_fkey";

-- AlterTable
ALTER TABLE "NilaiSiswa" DROP COLUMN "nis",
ADD COLUMN     "idJenisNilai" TEXT NOT NULL,
ADD COLUMN     "nisSiswa" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JenisNilai" ADD CONSTRAINT "JenisNilai_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NilaiSiswa" ADD CONSTRAINT "NilaiSiswa_idJenisNilai_fkey" FOREIGN KEY ("idJenisNilai") REFERENCES "JenisNilai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
