/*
  Warnings:

  - You are about to drop the column `userId` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GuruTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Testimoni` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `guruId` to the `Mata_Pelajaran` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_userId_fkey";

-- DropForeignKey
ALTER TABLE "GuruTemplate" DROP CONSTRAINT "GuruTemplate_userId_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_userId_fkey";

-- DropForeignKey
ALTER TABLE "Testimoni" DROP CONSTRAINT "Testimoni_userId_fkey";

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "userId",
ADD COLUMN     "guruId" TEXT;

-- AlterTable
ALTER TABLE "GuruTemplate" DROP COLUMN "userId",
ADD COLUMN     "guruId" TEXT;

-- AlterTable
ALTER TABLE "Mata_Pelajaran" ADD COLUMN     "guruId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "userId",
ADD COLUMN     "guruId" TEXT;

-- AlterTable
ALTER TABLE "Testimoni" DROP COLUMN "userId",
ADD COLUMN     "guruId" TEXT;

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Mata_Pelajaran" ADD CONSTRAINT "Mata_Pelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimoni" ADD CONSTRAINT "Testimoni_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuruTemplate" ADD CONSTRAINT "GuruTemplate_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
