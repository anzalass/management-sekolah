/*
  Warnings:

  - Added the required column `nip` to the `Kehadiran_Guru_Dan_Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kehadiran_Guru_Dan_Staff" ADD COLUMN     "nip" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Kehadiran_Guru_Dan_Staff" ADD CONSTRAINT "Kehadiran_Guru_Dan_Staff_nip_fkey" FOREIGN KEY ("nip") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
