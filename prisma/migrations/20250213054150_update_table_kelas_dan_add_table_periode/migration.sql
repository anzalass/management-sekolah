-- DropIndex
DROP INDEX "Kelas_nip_key";

-- CreateTable
CREATE TABLE "Periode_Tahun_Ajaran" (
    "id" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,

    CONSTRAINT "Periode_Tahun_Ajaran_pkey" PRIMARY KEY ("id")
);
