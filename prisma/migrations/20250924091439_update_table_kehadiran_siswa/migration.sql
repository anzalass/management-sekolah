-- DropForeignKey
ALTER TABLE "KehadiranSiswa" DROP CONSTRAINT "KehadiranSiswa_idKelas_fkey";

-- AlterTable
ALTER TABLE "KehadiranSiswa" ALTER COLUMN "idKelas" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "KehadiranSiswa" ADD CONSTRAINT "KehadiranSiswa_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
