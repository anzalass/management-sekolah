-- AlterTable
ALTER TABLE "PengumumanKelas" ADD COLUMN     "idGuru" TEXT;

-- AddForeignKey
ALTER TABLE "PengumumanKelas" ADD CONSTRAINT "PengumumanKelas_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
