-- CreateTable
CREATE TABLE "Jenis_Inventaris" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Jenis_Inventaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemeliharaan_Inventaris" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "biaya" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "Pemeliharaan_Inventaris_pkey" PRIMARY KEY ("id")
);
