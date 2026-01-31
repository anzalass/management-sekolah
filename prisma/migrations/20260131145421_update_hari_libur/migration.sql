-- CreateTable
CREATE TABLE "HariLibur" (
    "id" TEXT NOT NULL,
    "namaHari" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedOn" TIMESTAMP(3),

    CONSTRAINT "HariLibur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HariLibur_tahunAjaran_idx" ON "HariLibur"("tahunAjaran");
