/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_userId_fkey";

-- DropForeignKey
ALTER TABLE "GuruTemplate" DROP CONSTRAINT "GuruTemplate_userId_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_userId_fkey";

-- DropForeignKey
ALTER TABLE "Testimoni" DROP CONSTRAINT "Testimoni_userId_fkey";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Testimoni" ADD CONSTRAINT "Testimoni_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuruTemplate" ADD CONSTRAINT "GuruTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
