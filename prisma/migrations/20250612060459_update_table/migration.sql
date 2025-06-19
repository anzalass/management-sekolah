/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Guru` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "Guru"("email");
